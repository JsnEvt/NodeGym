import { FastifyInstance } from 'fastify';
import { create } from './controllers/create-controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', create)
}