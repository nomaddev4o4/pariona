import { db } from "@/db";
import {
  CountryGroupTable,
  CountryTable,
  ProductTable,
  ProductViewTable,
} from "@/db/schema";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { startOfDay, subDays } from "date-fns";
import { and, count, desc, eq, gte, SQL, sql } from "drizzle-orm";
import { tz } from "@date-fns/tz";
export function getProductViewCount(userId: string, startDate: Date) {
  const cacheFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cacheFn(userId, startDate);
}

export function getViewsByCountryChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export function getViewsByPPPChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByPPPChartInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
      getGlobalTag(CACHE_TAGS.countryGroups),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export function getViewsByDayChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByDayChartInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export async function createProductView({
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

async function getViewsByCountryChartDataInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });
  const productSq = getProductSubQuery(userId, productId);
  return await db
    .with(productSq)
    .select({
      views: count(ProductViewTable.visitedAt),
      countryName: CountryTable.name,
      countryCode: CountryTable.code,
    })
    .from(ProductViewTable)
    .innerJoin(productSq, eq(productSq.id, ProductViewTable.productId))
    .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
    .where(() =>
      gte(
        sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`.inlineParams(),
        startDate
      )
    )
    .groupBy(({ countryCode, countryName }) => [countryCode, countryName])
    .orderBy(({ views }) => desc(views))
    .limit(25);
}

async function getViewsByPPPChartInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });
  const productSq = getProductSubQuery(userId, productId);
  const productViewSq = db.$with("productViews").as(
    db
      .with(productSq)
      .select({
        visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as("visitedAt"),
        countryGroupId: CountryTable.countryGroupId,
      })
      .from(ProductViewTable)
      .innerJoin(productSq, eq(productSq.id, ProductViewTable.productId))
      .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
      .where(({ visitedAt }) => gte(visitedAt, startDate))
  );

  return await db
    .with(productViewSq)
    .select({
      pppName: CountryGroupTable.name,
      views: count(productViewSq.visitedAt),
    })
    .from(CountryGroupTable)
    .leftJoin(
      productViewSq,
      eq(productViewSq.countryGroupId, CountryGroupTable.id)
    )
    .groupBy(({ pppName }) => [pppName])
    .orderBy(({ pppName }) => [pppName]);
}

async function getViewsByDayChartInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const productSq = getProductSubQuery(userId, productId);
  const productViewSq = db.$with("productViews").as(
    db
      .with(productSq)
      .select({
        visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as("visitedAt"),
        productId: productSq.id,
      })
      .from(ProductViewTable)
      .innerJoin(productSq, eq(productSq.id, ProductViewTable.productId))
  );

  return await db
    .with(productViewSq)
    .select({
      date: interval
        .dateGrouper(sql.raw("series"))
        .mapWith((dateString) => interval.dateFormatter(new Date(dateString))),
      views: count(productViewSq.visitedAt),
    })
    .from(interval.sql)
    .leftJoin(productViewSq, ({ date }) =>
      eq(interval.dateGrouper(productViewSq.visitedAt), date)
    )
    .groupBy(({ date }) => [date])
    .orderBy(({ date }) => [date]);
}

function getProductSubQuery(userId: string, productId: string | undefined) {
  return db.$with("products").as(
    db
      .select()
      .from(ProductTable)
      .where(
        and(
          eq(ProductTable.clerkUserId, userId),
          productId == null ? undefined : eq(ProductTable.id, productId)
        )
      )
  );
}

export const CHART_INTERVALS = {
  last7Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    label: "Last 7 Days",
    startDate: subDays(new Date(), 7),
    sql: sql`GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last30Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    label: "Last 30 Days",
    startDate: subDays(new Date(), 30),
    sql: sql`GENERATE_SERIES(current_date - 30, current_date, '30 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last365Days: {
    dateFormatter: (date: Date) => monthFormatter.format(date),
    label: "Last 365 Days",
    startDate: subDays(new Date(), 365),
    sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
  },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "short",
  timeZone: "UTC",
});
