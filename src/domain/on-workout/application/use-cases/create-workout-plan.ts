import { Either, left, right } from '@/core/either'
import { Conflict } from './errors/conflict'
import { ResourceNotFound } from './errors/resource-not-found'
import { Unauthorized } from './errors/unauthorized'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'
import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository'
import { ProfessionalProfileRepository } from '../repositories/professional-profile.repository'
import { AthleteProfileRepository } from '../repositories/athlete-profile.repository'
import { Role } from '@/utils/enums/roles.enum'
import { WorkoutPlanExerciseList } from '../../enterprise/entities/workout-plan-exercise-list'

interface CreateWorkoutPlanUseCaseRequest {
  currentUserId: string
  athleteId: string
  expirationDate: Date
  exercises: [
    {
      id: string
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
    private professionalProfileRepository: ProfessionalProfileRepository,
    private athleteProfileRepository: AthleteProfileRepository,
    private workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async execute({
    currentUserId,
    athleteId,
    expirationDate,
    exercises,
  }: CreateWorkoutPlanUseCaseRequest): Promise<CreateWorkoutPlanUseCaseResponse> {
    const professional =
      await this.professionalProfileRepository.findByUserId(currentUserId)

    if (!professional) {
      return left(new ResourceNotFound('Professional not found.'))
    }

    if (professional.user.role !== Role.Professional) {
      return left(new Unauthorized())
    }

    const athlete = await this.athleteProfileRepository.findByUserId(athleteId)

    if (!athlete) {
      return left(new ResourceNotFound('Athlete not found.'))
    }

    const workoutPlan = WorkoutPlan.create({
      professionalId: professional.id,
      athleteId: athlete.id,
      expirationDate,
    })

    await this.workoutPlanRepository.create(workoutPlan)

    const workoutPlanExercises = exercises.map((exercise) => {
      return WorkoutPlanExercise.create({
        workoutPlanId: workoutPlan.id,
        exerciseId: new UniqueEntityID(exercise.id),
        repetitions: exercise.repetitions,
        restTime: exercise.restTime,
        exerciseTechnique: exercise.exerciseTechnique,
        sets: exercise.sets,
      })
    })

    workoutPlan.workoutPlanExercises = new WorkoutPlanExerciseList(
      workoutPlanExercises,
    )

    professional.workoutPlans.add(workoutPlan)

    await this.workoutPlanRepository.create(workoutPlan)

    return right({
      workoutPlan,
    })
  }
}
