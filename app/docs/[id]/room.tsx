"use client";

import { ReactNode, useEffect, useRef, useCallback } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { getUsers, getUsersByIds } from "./actions";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface RoomProps {
  children: ReactNode;
  roomId: string;
}

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export function Room({ children, roomId }: RoomProps) {
  const mentionUsersRef = useRef<User[]>([]);
  const params = useParams();

  const fetchMentionUsers = useCallback(async () => {
    try {
      const list = await getUsers();
      mentionUsersRef.current = list;
    } catch {
      toast.error("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchMentionUsers();
  }, [fetchMentionUsers]);

  const resolveUsers = useCallback(
    async ({ userIds }: { userIds: string[] }) => {
      return await getUsersByIds(userIds);
    },
    []
  );

  const resolveRoomsInfo = useCallback(
    async ({ roomIds }: { roomIds: string[] }) => {
      return await Promise.all(
        roomIds.map(async (roomId) => {
          try {
            const doc = await convex.query(api.documents.getByRoomIdPublic, { roomId });
            return {
              name: doc?.title
                ? doc.title.charAt(0).toUpperCase() + doc.title.slice(1)
                : "Untitled Document",
              url: doc ? `/documents/${doc._id}` : "/",
            };
          } catch {
            return { name: "Untitled Document", url: "/" };
          }
        })
      );
    },
    []
  );

  const resolveMentionSuggestions = useCallback(
    ({ text }: { text: string }) => {
      const list = mentionUsersRef.current;
      if (!text) return list.map((u) => u.id);
      return list
        .filter((u) => u.name.toLowerCase().includes(text.toLowerCase()))
        .map((u) => u.id);
    },
    []
  );

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = params.id as string;
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room }),
        });
        return await response.json();
      }}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={resolveRoomsInfo}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null }} initialStorage={{leftMargin:56,rightMargin:56}}>
        <ClientSideSuspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD]">
              <div className="text-[#5f6368] text-sm">Loading document…</div>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}