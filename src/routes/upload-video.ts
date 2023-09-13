import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from "node:util";
import { randomUUID } from 'node:crypto';
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits :{
      fileSize: 1048576 * 24  // 25mb
    }
  })


  app.post('/videos', async (req, reply) => {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input!'});
    }

    const extension = path.extname(data.filename);

    if (extension !== '.mp3') {
      return reply.status(400).send({ error: `Invalid input type, please make sure you're uploading a mp3 file!`});
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadFilePath = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadFilePath))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadFilePath,
      }
    })

    return reply.send({video});
  })
}