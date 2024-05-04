import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { Role } from '@/utils/enums/roles.enum'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { CustomExerciseRepository } from '../repositories/custom-exercise.repository'
import { Exercise } from '../../enterprise/entities/exercise'
import { UserProfileRepository } from '../repositories/user-profile.repository'

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
    private userProfileRepository: UserProfileRepository,
    private customExerciseRepository: CustomExerciseRepository,
  ) {}

  async execute({
    currentUserId,
    name,
    description,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const userProfile =
      await this.userProfileRepository.findByUserId(currentUserId)

    if (!userProfile) {
      return left(new ResourceNotFound('User not found.'))
    }

    if (userProfile?.role !== Role.Professional) {
      return left(new Unauthorized())
    }

    const exercise = Exercise.create({
      name,
      description,
      createdById: userProfile.id,
    })

    await this.customExerciseRepository.create(exercise)

    return right({
      exercise,
    })
  }
}
