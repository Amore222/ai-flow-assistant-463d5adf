import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runChat, runEmail, runNotes, runResearch, runTasks } from "./ai-run.server";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tone: z.string().min(1),
        audience: z.string().min(1),
        purpose: z.string().min(1),
        details: z.string().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => ({ text: await runEmail(data) }));

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ notes: z.string().min(1), context: z.string().optional() }).parse(input),
  )
  .handler(async ({ data }) => ({ text: await runNotes(data) }));

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tasks: z.string().min(1),
        framework: z.string().min(1),
        hours: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => ({ text: await runTasks(data) }));

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ topic: z.string().min(1), depth: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => ({ text: await runResearch(data) }));

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1),
            }),
          )
          .min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => ({ text: await runChat(data.messages) }));
