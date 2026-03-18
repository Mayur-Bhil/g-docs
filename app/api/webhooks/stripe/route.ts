import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover", // ✅ use your actual installed version
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";
type SubscriptionPlan = "free" | "pro";

interface UpsertArgs {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: number;
}

const STATUS_MAP = {
  active: "active",
  past_due: "past_due",
  trialing: "trialing",
  canceled: "cancelled",
  unpaid: "past_due",
} as const;

function getStatus(stripeStatus: string): SubscriptionStatus {
  return (STATUS_MAP as Record<string, SubscriptionStatus>)[stripeStatus] ?? "active";
}

function getPeriodEnd(subscription: Stripe.Subscription): number | undefined {
  const raw = (subscription as unknown as Record<string, unknown>).current_period_end;
  return typeof raw === "number" ? raw * 1000 : undefined;
}

function getSubscriptionId(invoice: Stripe.Invoice): string | null {
  return (
    (invoice as unknown as Record<string, unknown>).subscription as string | null
  ) ?? null;
}

async function upsert(args: UpsertArgs) {
  await convex.mutation(api.subscriptions.upsertSubscription, args); // ✅ api not internal
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await upsert({
          userId,
          plan: "pro",
          status: "active",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: getPeriodEnd(subscription),
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = getSubscriptionId(invoice);
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsert({
          userId,
          plan: "pro",
          status: "active",
          stripeCustomerId: invoice.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: getPeriodEnd(subscription),
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = getSubscriptionId(invoice);
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsert({
          userId,
          plan: "pro",
          status: "past_due",
          stripeSubscriptionId: subscription.id,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsert({
          userId,
          plan: "free",
          status: "cancelled",
          stripeSubscriptionId: subscription.id,
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const isInactive =
          subscription.status === "canceled" ||
          subscription.status === "unpaid";

        await upsert({
          userId,
          plan: isInactive ? "free" : "pro",
          status: getStatus(subscription.status),
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: getPeriodEnd(subscription),
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}