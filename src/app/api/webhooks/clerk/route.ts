import { env } from "@/data/env/server";
import {
  createUserSubscription,
  getUserSubscription,
} from "@/server/db/subscription";
import { deleteUser } from "@/server/db/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

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
          const userSubscription = await getUserSubscription(id);
          if (userSubscription?.stripeSubscriptionId != null) {
            await stripe.subscriptions.cancel(
              userSubscription?.stripeSubscriptionId
            );
          }
          await deleteUser(id);
        }
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
