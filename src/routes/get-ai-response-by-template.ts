import { FastifyInstance } from "fastify";
import { createReadStream } from 'node:fs';
import { openai } from '../lib/openai';
import { z } from 'zod';
import { prisma } from "../lib/prisma";

export async function getAIResponseByTemplate(app: FastifyInstance) {
  app.post('/ai/template', async (req, reply) => {

    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { videoId, template, temperature } = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      }
    })

    if (!video.transcription) {
      return reply.status(400).send({ error: 'Video transcription has not been generated yet!'});
    }

    const promptMessage = template.replace('{transcription}', video.transcription);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [{
        role: 'user', content: promptMessage
      }]
    })

    return reply.send({response})
  })
}