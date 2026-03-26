import { LuaTool, Data } from "lua-cli";
import { z } from "zod";

const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks.filter((c) => c.length > 0);
}

export class KnowledgeIngestTool implements LuaTool {
  name = "ingest_knowledge";
  description =
    "Ingest a document or text content into the knowledge base. Use this when the user uploads or pastes a .md or .txt file they want the agent to learn from.";

  inputSchema = z.object({
    content: z
      .string()
      .describe("The full text content of the document to ingest"),
    source: z
      .string()
      .optional()
      .describe(
        "Optional label or filename for this document (e.g. 'product-guide.md')"
      ),
    category: z
      .string()
      .optional()
      .describe(
        "Optional category to group documents (e.g. 'faq', 'policies', 'product-info')"
      ),
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const chunks = chunkText(input.content);

    const stored: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const entry = await Data.create(
        "knowledge",
        {
          text: chunk,
          source: input.source ?? "unknown",
          category: input.category ?? "general",
          chunkIndex: i,
          totalChunks: chunks.length,
          ingestedAt: new Date().toISOString(),
        },
        chunk
      );
      stored.push(entry.id);
    }

    return {
      success: true,
      chunksStored: stored.length,
      source: input.source ?? "unknown",
      category: input.category ?? "general",
      message: `Successfully ingested ${stored.length} chunk(s) from "${input.source ?? "document"}" into the knowledge base.`,
    };
  }
}
