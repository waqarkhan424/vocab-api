import { getDb } from "./mongo";

export type VocabFilters = {
  topic?: string;   // 'all' or a specific topic slug
  q?: string;       // search text
  page?: number;    // 1-based
  limit?: number;   // 10..50
};

export async function getTopics() {
  const db = await getDb();
  const rows = await db.collection("Vocabulary").aggregate([
    { $group: { _id: "$topic", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();

  const total = rows.reduce((s, r) => s + (r.count || 0), 0);
  return [
    { topic: "all", count: total },
    ...rows.map(r => ({ topic: r._id as string, count: r.count as number }))
  ];
}

export async function getVocabPage({
  topic,
  q = "",
  page = 1,
  limit = 20
}: VocabFilters) {
  const take = Math.min(50, Math.max(10, limit));
  const skip = (Math.max(1, page) - 1) * take;

  const db = await getDb();

  const where: any = {};
  const isGlobalSearch = q.trim().length > 0;

  // 🔑 Global search UX: if user typed something, search across ALL topics
  if (!isGlobalSearch && topic && topic !== "all") {
    where.topic = topic;
  }

  if (q) {
    // Correctly escape regex special chars in the query
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    where.$or = [
      { word: rx },
      { definition: rx },
      { urduMeaning: rx }
    ];
  }

  const coll = db.collection("Vocabulary");
  const [items, total] = await Promise.all([
    coll
      .find(where, {
        projection: {
          word: 1,
          definition: 1,
          urduMeaning: 1,
          example: 1,
          topic: 1
        }
      })
      // Note: no alphabetical sort -> avoids A→Z grouping
      .skip(skip)
      .limit(take)
      .toArray(),
    coll.countDocuments(where)
  ]);

  return {
    items: items.map(i => ({ id: String(i._id), ...i, _id: undefined })),
    page,
    limit: take,
    total,
    hasMore: skip + items.length < total
  };
}
