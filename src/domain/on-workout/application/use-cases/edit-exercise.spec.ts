import { Role } from '@/utils/enums/roles.enum'
import { InMemoryCustomExerciseRepository } from 'test/repositories/in-memory-custom-exercise-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { EditExerciseUseCase } from './edit-exercise'
import { makeExercise } from '../../enterprise/factories/make-exercise'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Unauthorized } from './errors/unauthorized'
import { makeUser } from '../../enterprise/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomExerciseRepository: InMemoryCustomExerciseRepository
let sut: EditExerciseUseCase

describe('Edit Exercise', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomExerciseRepository = new InMemoryCustomExerciseRepository()
    sut = new EditExerciseUseCase(
      inMemoryUserRepository,
      inMemoryCustomExerciseRepository,
    )
  })

  it('should be able to edit a custom exercise', async () => {
    const professional = makeUser({ role: Role.Professional })
    const exercise = makeExercise({
      name: 'supino reto',
      description: 'exercicio para peitoral',
      createdById: professional.id,
    })

    inMemoryUserRepository.create(professional)
    inMemoryCustomExerciseRepository.create(exercise)

    const result = await sut.execute({
      currentUserId: professional.id.toString(),
      exerciseId: exercise.id.toString(),
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryCustomExerciseRepository.items[0]).toMatchObject({
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })
  })

  it('should not be able to edit a custom exercise if user is not the creator', async () => {
    const professional = makeUser({ role: Role.Professional })

    const exercise = makeExercise({
      name: 'supino reto',
      description: 'exercicio para peitoral',
      createdById: new UniqueEntityID('another-id'),
    })

    inMemoryUserRepository.create(professional)
    inMemoryCustomExerciseRepository.create(exercise)

    const result = await sut.execute({
      currentUserId: professional.id.toString(),
      exerciseId: exercise.id.toString(),
      name: 'supino inclinado',
      description: 'exercicio para peitoral superior',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(Unauthorized)
  })
})
