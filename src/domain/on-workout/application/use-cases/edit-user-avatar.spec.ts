import { EditUserAvatarUseCase } from './edit-user-avatar'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { InMemoryUserProfileRepository } from 'test/repositories/in-memory-user-profile.repository'
import { Unauthorized } from './errors/unauthorized'
import { makeUser } from '../../enterprise/factories/make-user'

let inMemoryUserProfileRepository: InMemoryUserProfileRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: EditUserAvatarUseCase

describe('Update User Avatar', () => {
  beforeEach(() => {
    inMemoryUserProfileRepository = new InMemoryUserProfileRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new EditUserAvatarUseCase(
      inMemoryUserRepository,
      inMemoryUserProfileRepository,
    )
  })

  it('should be able to edit a professional user avatar', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)
    inMemoryUserProfileRepository.items.push(user.userProfile!)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentUserId: user.id.toString(),
      avatar: 'new-avatar.jpg',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryUserRepository.items[0].userProfile?.profile.avatar).toEqual(
      'new-avatar.jpg',
    )
  })

  it('should not be able to edit an user avatar if current user is not the owner', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)
    inMemoryUserProfileRepository.items.push(user.userProfile!)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentUserId: 'other-user-id',
      avatar: 'new-avatar.jpg',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })
})
