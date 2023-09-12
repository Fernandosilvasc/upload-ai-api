import {fastify} from 'fastify';

const app = fastify();

const PORT = process.env.PORT || '3333';

app.get('/', () => {
  return 'Hello there!'
})

app.listen({
  port: Number(PORT)
}).then(() => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`)   // eslint-disable-line no-console
})