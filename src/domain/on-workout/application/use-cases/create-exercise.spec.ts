import { InMemoryCustomExerciseRepository } from 'test/repositories/in-memory-custom-exercise-repository'
import { CreateExerciseUseCase } from './create-exercise'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from '../../enterprise/factories/make-user'
import { Role } from '@/utils/enums/roles.enum'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomExerciseRepository: InMemoryCustomExerciseRepository
let sut: CreateExerciseUseCase

describe('Create Exercise', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomExerciseRepository = new InMemoryCustomExerciseRepository()
    sut = new CreateExerciseUseCase(
      inMemoryUserRepository,
      inMemoryCustomExerciseRepository,
    )
  })

  it('should be able to create a custom exercise', async () => {
    const user = makeUser({
      role: Role.Professional,
    })

    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      currentUserId: user.id.toString(),
      name: 'exercise name',
      description: 'exercise description',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryCustomExerciseRepository.items[0]).toMatchObject({
      name: 'exercise name',
      description: 'exercise description',
      createdById: user.id,
    })
  })

  it('should not be able to create a custom exercise if the user is not a professional', async () => {
    const user = makeUser({
      role: Role.Athlete,
    })

    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      currentUserId: user.id.toString(),
      name: 'exercise name',
      description: 'exercise description',
    })

    expect(result.isLeft()).toEqual(true)
  })
})
