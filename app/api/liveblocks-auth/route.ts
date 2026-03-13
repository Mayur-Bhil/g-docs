import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stringToColor } from "@/app/docs/[id]/utils-color";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { room } = await request.json();

  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name:
        user.fullName ??
        user.primaryEmailAddress?.emailAddress ??
        "Anonymous",
      avatar: user.imageUrl,
      color: stringToColor(userId),
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new NextResponse(body, { status });
}