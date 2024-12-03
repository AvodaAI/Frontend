//src/app/(auth)/clerkusers/actions/getClerkEmail.ts
//FIXME: this should be in the getClerkUsers action 
"use server";

import { clerkClient } from "@clerk/nextjs/server";

const clerk = clerkClient();

export async function getClerkEmail(emailAddressId: string) {
  try {
    const emailData = await (await clerk).emailAddresses.getEmailAddress(emailAddressId);
    return emailData.emailAddress;
  } catch (error) {
    console.error(`Error fetching email for ID ${emailAddressId}:`, error);
    return null;
  }
}
