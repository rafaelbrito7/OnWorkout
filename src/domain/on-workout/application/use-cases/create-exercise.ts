import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { Role } from '@/utils/enums/roles.enum'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { CustomExerciseRepository } from '../repositories/custom-exercise.repository'
import { Exercise } from '../../enterprise/entities/exercise'
import { UserRepository } from '../repositories/user.repository'

interface CreateExerciseUseCaseRequest {
  currentUserId: string
  name: string
  description: string
}

type CreateExerciseUseCaseResponse = Either<
  ResourceNotFound | Conflict | Unauthorized,
  { exercise: Exercise }
>

export class CreateExerciseUseCase {
  constructor(
    private userRepository: UserRepository,
    private customExerciseRepository: CustomExerciseRepository,
  ) {}

  async execute({
    currentUserId,
    name,
    description,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const professional = await this.userRepository.findById(currentUserId)

    if (!professional) {
      return left(new ResourceNotFound('Professional not found.'))
    }

    if (professional.role !== Role.Professional) {
      return left(new Unauthorized())
    }

    const exercise = Exercise.create({
      name,
      description,
      createdById: professional.id,
    })

    await this.customExerciseRepository.create(exercise)

    return right({
      exercise,
    })
  }
}
