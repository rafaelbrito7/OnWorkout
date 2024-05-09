import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { CustomExerciseRepository } from '../repositories/custom-exercise.repository'
import { Exercise } from '../../enterprise/entities/exercise'
import { UserRepository } from '../repositories/user.repository'

interface EditExerciseUseCaseRequest {
  currentUserId: string
  exerciseId: string
  name: string
  description: string
}

type EditExerciseUseCaseResponse = Either<
  ResourceNotFound | Conflict | Unauthorized,
  { exercise: Exercise }
>

export class EditExerciseUseCase {
  constructor(
    private userRepository: UserRepository,
    private customExerciseRepository: CustomExerciseRepository,
  ) {}

  async execute({
    currentUserId,
    exerciseId,
    name,
    description,
  }: EditExerciseUseCaseRequest): Promise<EditExerciseUseCaseResponse> {
    const professional = await this.userRepository.findById(currentUserId)

    if (!professional) {
      return left(new ResourceNotFound('Professional not found.'))
    }

    const exercise = await this.customExerciseRepository.findById(exerciseId)

    if (!exercise) {
      return left(new ResourceNotFound('Exercise not found.'))
    }

    if (professional.id !== exercise.createdById) {
      return left(new Unauthorized())
    }

    exercise.name = name
    exercise.description = description

    await this.customExerciseRepository.save(exercise)

    return right({
      exercise,
    })
  }
}
