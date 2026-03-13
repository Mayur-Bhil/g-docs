"use client";

import { ReactNode, useEffect, useRef, useCallback } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { getUsers, getUsersByIds } from "./actions";
import { toast } from "sonner";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  // orgId prop removed — getUsers() now finds the org via Clerk memberships API
  // so we don't need to thread it through from the page
}

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export function Room({ children, roomId }: RoomProps) {
  const mentionUsersRef = useRef<User[]>([]);

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
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
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