import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateUseCase } from '@/use-cases/create-use-case'
import { PrismaUsersRepository } from '@/repositories/prismaUsersRepositories'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const createUseCase = new CreateUseCase(prismaUsersRepository)

    await createUseCase.execute({
      name, email, password
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    //camada de erro para tratar quando não houver relacionamentos com os outros já digitados.
    //a linha abaixo cai numa tratativa para o fastify.
    throw err
  }
  return reply.status(201).send()
}