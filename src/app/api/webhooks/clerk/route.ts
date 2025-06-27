import { createUserSubscription } from "@/server/db/subscription";
import { deleteUser } from "@/server/db/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;

    switch (eventType) {
      case "user.created": {
        await createUserSubscription({
          clerkUserId: id!,
          tier: "Free",
        });
        break;
      }

      case "user.deleted": {
        if (id) {
          await deleteUser(id);
          // TODO: Remove stripe subscription
        }
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
