import { LuaTool, Data } from "lua-cli";
import { z } from "zod";

export class KnowledgeQueryTool implements LuaTool {
  name = "query_knowledge";
  description =
    "Search the knowledge base to answer a user's question. Use this whenever a user asks a question that may be answered from uploaded documents.";

  inputSchema = z.object({
    question: z
      .string()
      .describe("The user's question or query to search the knowledge base for"),
    category: z
      .string()
      .optional()
      .describe(
        "Optional: limit search to a specific category (e.g. 'faq', 'policies', 'product-info')"
      ),
    limit: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of relevant chunks to retrieve (default: 5)"),
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const results = await Data.search(
      "knowledge",
      input.question,
      input.limit,
      0.3
    );

    if (!results || results.length === 0) {
      return {
        found: false,
        message:
          "No relevant information found in the knowledge base for this question.",
        chunks: [],
      };
    }

    const filtered = input.category
      ? results.filter(
          (entry: any) => entry.data?.category === input.category
        )
      : results;

    const chunks = filtered.map((entry: any) => ({
      text: entry.data?.text ?? "",
      source: entry.data?.source ?? "unknown",
      category: entry.data?.category ?? "general",
      relevanceScore: entry.score,
    }));

    return {
      found: true,
      chunks,
      totalFound: chunks.length,
    };
  }
}
