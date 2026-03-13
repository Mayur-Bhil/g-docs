"use client";

import { Separator } from "@/components/ui/separator";
import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const AVATAR_SIZE = 36;

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

const AvatarStack = () => {
  const others = useOthers();
  const currentUser = useSelf();

  // ✅ FIX: Don't return null just because others.length === 0
  // Current user should always show if present
  if (!currentUser && others.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="flex items-center">
          {/* Current user avatar */}
          {currentUser && (
            <div className="relative ml-2">
              <Avatar src={currentUser.info.avatar} name="You" />
            </div>
          )}

          {/* Other users' avatars */}
          <div className="flex">
            {others.map(({ connectionId, info }) => (
              <Avatar
                key={connectionId}
                src={info.avatar}
                name={info.name}
              />
            ))}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};

interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      // ✅ FIX: "felx" typo corrected to "flex"
      className="group -ml-2 flex shrink-0 place-content-center relative border-2 border-white rounded-full bg-gray-400 overflow-hidden"
    >
      {/* Tooltip */}
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity pointer-events-none">
        {name}
      </div>
      <img
        alt={name}
        src={src}
        className="size-full rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};