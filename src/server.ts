import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { getAIResponseByTemplate } from './routes/get-ai-response-by-template';


const app = fastify();

const PORT = process.env.PORT || '3333';

app.register(fastifyCors, {
  origin: '*',
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(getAIResponseByTemplate)

app.listen({
  port: Number(PORT)
}).then(() => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`)  
})