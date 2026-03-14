"use client";

import { BellIcon, Trash2Icon } from "lucide-react";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useDeleteInboxNotification,
  useMarkAllInboxNotificationsAsRead,
} from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const InBox = () => {
  return (
    <ClientSideSuspense
      fallback={
        <Button variant="ghost" size="icon" className="relative" disabled>
          <BellIcon className="size-5" />
        </Button>
      }
    >
      <InBoxMenu />
    </ClientSideSuspense>
  );
};

const InBoxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count: unreadCount } = useUnreadInboxNotificationsCount();
  const deleteInboxNotification = useDeleteInboxNotification();         // ← fixed
  const markAllInboxNotificationsAsRead = useMarkAllInboxNotificationsAsRead(); // ← fixed

  const handleDelete = (id: string) => {
    deleteInboxNotification(id);
    toast.success("Notification deleted");
  };

  const handleMarkAllRead = () => {
    markAllInboxNotificationsAsRead();
    toast.success("All notifications marked as read");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors"
        >
          <BellIcon className="size-5 text-[#444746]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1a73e8] text-[11px] font-semibold text-white flex items-center justify-center leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 rounded-xl shadow-lg border border-[#e1e3e6] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e3e6] bg-white">
          <h3 className="text-sm font-semibold text-[#202124]">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#1a73e8] font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
            {inboxNotifications.length > 0 && (
              <span className="text-[#e1e3e6]">·</span>
            )}
            {inboxNotifications.length > 0 && (
              <span className="text-xs text-[#9aa0a6]">
                {inboxNotifications.length} total
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[420px] overflow-y-auto bg-white">
          {inboxNotifications.length > 0 ? (
            <InboxNotificationList>
              {inboxNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="group relative flex items-start border-b border-[#f1f3f4] last:border-0 hover:bg-[#f8f9fa] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <InboxNotification
                      inboxNotification={notification}
                      className="px-4 py-3 cursor-pointer"
                      href={`/documents/${notification.roomId}`}
                    />
                  </div>

                  {/* Delete button — visible on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 p-1.5 rounded-md hover:bg-red-50 text-[#9aa0a6] hover:text-red-500"
                    title="Delete notification"
                  >
                    <Trash2Icon className="size-3.5" />
                  </button>
                </div>
              ))}
            </InboxNotificationList>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f1f3f4] flex items-center justify-center">
                <BellIcon className="size-5 text-[#9aa0a6]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#202124]">No notifications</p>
                <p className="text-xs text-[#9aa0a6] mt-0.5">You're all caught up!</p>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};