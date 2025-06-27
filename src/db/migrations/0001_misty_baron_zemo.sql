ALTER TABLE "user_subscription" RENAME TO "user_subscriptions";--> statement-breakpoint
ALTER TABLE "user_subscriptions" RENAME COLUMN "stripe_cutomer_id" TO "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscription_clerk_user_id_unique";--> statement-breakpoint
DROP INDEX "user_subscription.clerk_user_id_index";--> statement-breakpoint
DROP INDEX "user_subscription.stripe_customer_id_index";--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "location_message" SET DEFAULT 'Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off.';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "user_subscriptions.clerk_user_id_index" ON "user_subscriptions" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions.stripe_customer_id_index" ON "user_subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_clerk_user_id_unique" UNIQUE("clerk_user_id");