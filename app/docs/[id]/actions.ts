"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { stringToColor } from "./utils-color";

/**
 * Returns all users that should appear in the @mention list.
 *
 * Root cause of "only see yourself":
 * - sessionClaims?.org_id is only set when the user has an ACTIVE org session
 * - If they opened the doc via a direct link without switching to the org,
 *   org_id is undefined → only they themselves were returned
 *
 * Fix: use Clerk's organizationMemberships API to find ALL orgs the user
 * belongs to, then return all members of those orgs.
 * This works regardless of which org is "active" in the session.
 */
export async function getUsers() {
  const { userId } = await auth();
  if (!userId) return [];

  const clerk = await clerkClient();

  // Get all orgs this user belongs to
  const memberships = await clerk.users.getOrganizationMembershipList({
    userId,
  });

  if (memberships.data.length > 0) {
    // Collect all members from all orgs this user is part of
    const allUserMaps = new Map<string, ReturnType<typeof mapUser>>();

    await Promise.all(
      memberships.data.map(async (membership) => {
        const orgId = membership.organization.id;
        const response = await clerk.organizations.getOrganizationMembershipList({
          organizationId: orgId,
          limit: 100,
        });
        response.data.forEach((m) => {
          const u = m.publicUserData;
          if (!u?.userId) return;
          allUserMaps.set(u.userId, {
            id: u.userId,
            name:
              `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
              u.identifier ||
              "Unknown User",
            avatar: u.imageUrl ?? "",
            color: stringToColor(u.userId),
          });
        });
      })
    );

    return Array.from(allUserMaps.values());
  }

  // No org — return just the current user
  const user = await clerk.users.getUser(userId);
  return [mapUser(user)];
}

/**
 * Resolves specific userIds → display info.
 * Used by Liveblocks resolveUsers on both sender and receiver side.
 */
export async function getUsersByIds(userIds: string[]) {
  if (!userIds.length) return [];
  const clerk = await clerkClient();

  const results = await Promise.allSettled(
    userIds.map((id) => clerk.users.getUser(id))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") {
      return mapUser(result.value);
    }
    return {
      id: userIds[i],
      name: "Unknown User",
      avatar: "",
      color: stringToColor(userIds[i]),
    };
  });
}

function mapUser(user: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
}) {
  return {
    id: user.id,
    name:
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      user.emailAddresses[0]?.emailAddress ||
      "Unknown User",
    avatar: user.imageUrl,
    color: stringToColor(user.id),
  };
}