import { IUsersRepository } from '@/repositories/IPrisma/users-repository';
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists';

interface CreateUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ name, email, password }: CreateUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}

