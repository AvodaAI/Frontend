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

interface EmailAddress {
  id: string;
  emailAddress: string;
  verification: {
    status: string;
  } | null;
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
  emailAddresses: EmailAddress[];
  lastSignInAt: number | null;
  lastActiveAt: number | null;
  updatedAt: number;
  createdAt: number;
}

interface GetClerkUsersResponse {
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
      publicMetadata: clerkUser.publicMetadata,
      privateMetadata: clerkUser.privateMetadata,
      emailAddresses: clerkUser.emailAddresses.map(email => ({
        ...email,
        verification: email.verification ?? { status: 'unknown' }
      })),
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
