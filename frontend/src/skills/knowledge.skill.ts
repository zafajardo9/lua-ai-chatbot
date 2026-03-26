import { LuaSkill } from "lua-cli";
import { KnowledgeIngestTool } from "./tools/KnowledgeIngestTool";
import { KnowledgeQueryTool } from "./tools/KnowledgeQueryTool";

const knowledgeSkill = new LuaSkill({
  name: "knowledge-base-skill",
  description:
    "Ingest documents and answer questions from the knowledge base. Use this skill to store information from uploaded files and retrieve answers based on that knowledge.",
  context: `
    This skill manages a knowledge base built from uploaded .md and .txt documents.

    - Use ingest_knowledge when the user uploads or pastes document content they want the agent to learn from.
    - Use query_knowledge whenever the user asks a question that may be answered from previously ingested documents.

    When answering questions:
    - Use query_knowledge only for content that was added through ingest_knowledge.
    - If the user's knowledge was uploaded through Lua resources, rely on the built-in RAG/resources system instead of query_knowledge.
    - If relevant chunks are found, synthesize a clear answer from them and mention the source document.
    - If query_knowledge finds nothing, do not claim that all knowledge is missing if Lua resources may still contain the answer.
    - Do not make up answers that aren't grounded in the retrieved chunks.
  `,
  tools: [new KnowledgeIngestTool(), new KnowledgeQueryTool()],
});

export default knowledgeSkill;
