import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'
import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'
import { WorkoutPlanExerciseRepository } from '../repositories/workout-plan-exercise.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository'
import { UserRepository } from '../repositories/user.repository'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'
import { AthleteProfileRepository } from '../repositories/athlete-profile.repository'
import { User } from '../../enterprise/entities/user'

interface CreateWorkoutPlanUseCaseRequest {
  currentUserId: string
  athleteId: string
  expirationDate: Date
  exercises: [
    {
      exerciseId: string
      sets: number
      repetitions: number
      restTime: number
      exerciseTechnique?: string
    },
  ]
}

type CreateWorkoutPlanUseCaseResponse = Either<
  ResourceNotFound | Conflict | Unauthorized,
  { workoutPlan: WorkoutPlan }
>

export class CreateWorkoutPlanUseCase {
  constructor(
    private userRepository: UserRepository,
    private professionalProfileRepository: ProfessionalProfileRepository,
    private athleteProfileRepository: AthleteProfileRepository,
    private workoutPlanRepository: WorkoutPlanRepository,
    private workoutPlanExerciseRepository: WorkoutPlanExerciseRepository,
  ) {}

  async execute({
    currentUserId,
    athleteId,
    expirationDate,
    exercises,
  }: CreateWorkoutPlanUseCaseRequest): Promise<CreateWorkoutPlanUseCaseResponse> {
    const professionalUser = await this.userRepository.findById(currentUserId)

    if (!professionalUser) {
      return left(new ResourceNotFound('User not found.'))
    }

    if (!professionalUser.isProfessional()) {
      return left(new Unauthorized())
    }

    const professionalProfile =
      await this.professionalProfileRepository.findById(
        professionalUser.profileId.toString(),
      )

    const athleteUser = await this.userRepository.findById(athleteId)

    if (!athleteUser) {
      return left(new ResourceNotFound('Athlete not found.'))
    }

    const workoutPlan = WorkoutPlan.create({
      professionalId: professionalUser.id,
      athleteId: athleteUser.id,
      expirationDate,
    })

    await this.workoutPlanRepository.create(workoutPlan)

    const workoutPlanExercises = exercises.map(async (exercise) => {
      const workoutPlanExercise = WorkoutPlanExercise.create({
        workoutPlanId: workoutPlan.id,
        exerciseId: new UniqueEntityID(exercise.exerciseId),
        repetitions: exercise.repetitions,
        restTime: exercise.restTime,
        exerciseTechnique: exercise.exerciseTechnique,
        sets: exercise.sets,
      })

      await this.workoutPlanExerciseRepository.create(workoutPlanExercise)

      return workoutPlanExercise
    })

    professionalUser.profile = professionalUser.profile as ProfessionalProfile

    return right({
      workoutPlan,
    })
  }
}
