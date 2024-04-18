import { IUserRepository } from '../repositories/user.repository'
import { CreateUserUseCase } from './create-user'

const fakeUserRepository: IUserRepository = {
  create: async (user: User) => {},
}

test('create an answer', async () => {
  const createUser = new CreateUserUseCase(fakeUserRepository)

  const user = await createUser.execute({
    email: 'any_email',
    password: 'any_password',
    profileId: 'any_profile_id',
  })

  expect(user.email).toEqual('any_email')
  expect(user.password).toEqual('any_password')
  expect(user.profileId).toEqual('any_profile_id')
})
