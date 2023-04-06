import { expect, describe, it } from 'vitest'
import { CreateUseCase } from './create-use-case'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'


8//eis aqui um exemplo de um teste unitario, cujos dados nao batem no DB.
//eles nao usam o prisma para realizar os testes, e sim, um db fake. 




describe('Create Use Case', () => {
  it('should be able to create', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUseCase = new CreateUseCase(usersRepository)
    const { user } = await createUseCase.execute({
      name: 'js',
      email: 'js1@email.com',
      password: '123456'
    })
    expect(user.id).toEqual(expect.any(String))
  })


  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUseCase = new CreateUseCase(usersRepository)
    const { user } = await createUseCase.execute({
      name: 'js',
      email: 'js1@email.com',
      password: '123456'
    })
    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUseCase = new CreateUseCase(usersRepository)

    const email = 'js1@email.com'

    await createUseCase.execute({
      name: 'js',
      email,
      password: '123456'
    })

    await expect(() => createUseCase.execute({
      name: 'js',
      email,
      password: '123456'
    })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})