import { NextRequest } from "next/server";
import { handleChatRequest } from "@/lib/ai/handler";
import type { SafetySetting } from "@/lib/ai/types";
import { systemPrompt } from "@/lib/prompts";
import { findTopic } from "@/lib/topics";

const MAX_MESSAGES = 50;

const SAFETY_SETTINGS: SafetySetting[] = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

function sanitizeForPrompt(input: string): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").slice(0, 5000);
}

export async function POST(request: NextRequest) {
  return handleChatRequest(request, {
    maxMessages: MAX_MESSAGES,
    safetySettings: SAFETY_SETTINGS,
    prepare: (lastUserMessage) => {
      const topic = findTopic(lastUserMessage);

      if (!topic) {
        return { systemPrompt, meta: null };
      }

      const topicContext = `\n[TOPIC CONTEXT — VERIFIED INFORMATION]\nThe user is asking about: ${sanitizeForPrompt(topic.title)}\n\nSteps:\n${topic.steps.map((s, i) => `${i + 1}. ${sanitizeForPrompt(s.title)}: ${sanitizeForPrompt(s.description)}`).join("\n")}\n\nDocuments needed:\n${topic.documents.map((d) => `- ${sanitizeForPrompt(d)}`).join("\n")}\n\nWhere to go:\n${sanitizeForPrompt(topic.office.name)}\n${topic.office.address ? `Address: ${sanitizeForPrompt(topic.office.address)}` : ""}\n${topic.office.hours ? `Hours: ${sanitizeForPrompt(topic.office.hours)}` : ""}\n${topic.office.website ? `Website: ${topic.office.website}` : ""}\n\nSource: ${sanitizeForPrompt(topic.source.name)}${topic.source.url ? ` (${topic.source.url})` : ""}\n${topic.locationNote ? `\nLocation note: ${sanitizeForPrompt(topic.locationNote)}` : ""}\n[/TOPIC CONTEXT]\n\nUse this information to help the user, but present it naturally in conversation.`;

      return {
        systemPrompt: systemPrompt + topicContext,
        meta: {
          topicId: topic.id,
          topicTitle: topic.title,
          steps: topic.steps,
          documents:
            topic.documents.length > 0 ? topic.documents : undefined,
          office: topic.office,
          source: topic.source,
        },
      };
    },
  });
}
