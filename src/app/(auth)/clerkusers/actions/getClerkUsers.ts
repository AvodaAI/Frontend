//src/app/actions/getClerkUsers.ts
"use server";

import { clerkClient } from "@clerk/nextjs/server";

const clerk = clerkClient();

interface GetClerkUsersParams {
  emailAddress?: string;
  emailAddressQuery?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

interface ClerkUser {
  id: string;
  externalId: string | null;
  primaryEmailAddressId: string | null;
  primaryPhoneNumberId: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
  lastSignInAt: number | null;
  lastActiveAt: number | null;
  updatedAt: number;
  createdAt: number;
}

export interface GetClerkUsersResponse {
  data: ClerkUser[];
  success?: boolean;
  error?: string;
}

export async function getClerkUsers(
  params?: GetClerkUsersParams
): Promise<GetClerkUsersResponse> {
  try {
    const { limit = 10, offset = 0 } = params || {};

    const response = await (
      await clerk
    ).users.getUserList({
      limit,
      offset,
    });

    const serializedUsers = response.data.map((clerkUser) => ({
      id: clerkUser.id,
      externalId: clerkUser.externalId,
      primaryEmailAddressId: clerkUser.primaryEmailAddressId,
      primaryPhoneNumberId: clerkUser.primaryPhoneNumberId,
      username: clerkUser.username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      publicMetadata: JSON.parse(JSON.stringify(clerkUser.publicMetadata)), 
      privateMetadata: JSON.parse(JSON.stringify(clerkUser.privateMetadata)), 
      lastSignInAt: clerkUser.lastSignInAt,
      lastActiveAt: clerkUser.lastActiveAt,
      updatedAt: clerkUser.updatedAt,
      createdAt: clerkUser.createdAt,
    }));

    return {
      data: serializedUsers,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}
