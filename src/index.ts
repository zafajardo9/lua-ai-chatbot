import { LuaAgent } from "lua-cli";
import knowledgeSkill from "./skills/knowledge.skill";

const agent = new LuaAgent({
    name: 'Sales Customer Service',

    persona: `Placeholder persona`,

    skills: [knowledgeSkill],

    // Optional: Add webhooks for external integrations
    // webhooks: [],

    // Optional: Add scheduled jobs
    // jobs: [],

    // Optional: Add message preprocessors
    // preProcessors: [],

    // Optional: Add response postprocessors
    // postProcessors: [],
});

export { agent };
