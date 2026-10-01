import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});

const INDEX = "emails";

export async function ensureIndex() {
  const exists = await esClient.indices.exists({ index: INDEX });
  if (!exists) {
    await esClient.indices.create({
      index: INDEX,
      mappings: {
        properties: {
          id: { type: "keyword" },
          userId: { type: "keyword" },
          recipient: { type: "text" },
          subject: { type: "text" },
          body: { type: "text" },
          senderEmail: { type: "keyword" },
          status: { type: "keyword" },
          scheduledAt: { type: "date" },
          sentAt: { type: "date" },
        },
      },
    });
  }
}

export async function indexEmail(doc: Record<string, unknown>) {
  await esClient.index({ index: INDEX, id: doc.id as string, document: doc });
}

export async function updateEmailIndex(id: string, fields: Record<string, unknown>) {
  await esClient.update({ index: INDEX, id, doc: fields });
}

export async function searchEmails(userId: string, query: string) {
  const res = await esClient.search({
    index: INDEX,
    query: {
      bool: {
        must: [
          { term: { userId } },
          {
            multi_match: {
              query,
              fields: ["recipient", "subject", "body"],
            },
          },
        ],
      },
    },
  });
  return res.hits.hits.map((h) => h._source);
}
