"use client"

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, AuthLoading, Unauthenticated, Authenticated } from "convex/react";
import { SignIn } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthLoading>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </AuthLoading>
        <Authenticated>
          {children}
        </Authenticated>
        <Unauthenticated>
          <div className="flex items-center justify-center min-h-screen">
            <SignIn routing="hash" />
          </div>
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}