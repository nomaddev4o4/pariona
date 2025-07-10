import { db } from "@/db";
import { ProductTable, ProductViewTable } from "@/db/schema";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { and, count, eq, gte } from "drizzle-orm";

export function getProductViewCount(userId: string, startDate: Date) {
  const cacheFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cacheFn(userId, startDate);
}

export async function createProducView({
  productId,
  countryId,
  userId,
}: {
  productId: string;
  countryId: string | undefined;
  userId: string;
}) {
  const [newRow] = await db
    .insert(ProductViewTable)
    .values({
      productId,
      visitedAt: new Date(),
      countryId,
    })
    .returning({ id: ProductViewTable.id });

  if (newRow != null) {
    revalidateDbCache({ tag: CACHE_TAGS.productViews, userId, id: newRow.id });
  }
}

async function getProductViewCountInternal(userId: string, startDate: Date) {
  const counts = await db
    .select({ pricingViewCount: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId))
    .where(
      and(
        eq(ProductTable.clerkUserId, userId),
        gte(ProductViewTable.visitedAt, startDate)
      )
    );

  return counts[0]?.pricingViewCount ?? 0;
}
