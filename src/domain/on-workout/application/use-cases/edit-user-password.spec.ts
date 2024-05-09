import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { Unauthorized } from './errors/unauthorized'
import { EditUserPasswordUseCase } from './edit-user-password'
import { compare, hash } from 'bcryptjs'
import { BadRequest } from './errors/bad-request'
import { makeUser } from '../../enterprise/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: EditUserPasswordUseCase

describe('Update User Password', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new EditUserPasswordUseCase(inMemoryUserRepository)
  })

  it('should be able to edit an athlete user password', async () => {
    const password = await hash('old-password', 8)

    const user = makeUser({ password })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentUserId: user.id.toString(),
      newPassword: 'new-password',
      oldPassword: 'old-password',
    })

    expect(result.isRight()).toEqual(true)
    expect(
      compare(inMemoryUserRepository.items[0].password, 'new-password'),
    ).toBeTruthy()
  })

  it('should not be able to edit an user password if current user is not the owner', async () => {
    const password = await hash('old-password', 8)

    const user = makeUser({ password })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentUserId: 'another-user-id',
      newPassword: 'new-password',
      oldPassword: 'old-password',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })

  it('should not be able to edit an user password if old password does not match', async () => {
    const wrongPassword = await hash('wrong-password', 8)

    const user = makeUser({ password: wrongPassword })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentUserId: user.id.toString(),
      newPassword: 'new-password',
      oldPassword: 'old-password',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(BadRequest)
  })
})
