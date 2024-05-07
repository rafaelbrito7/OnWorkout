import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface WorkoutPlanExerciseProps {
  workoutPlanId: UniqueEntityID
  exerciseId: UniqueEntityID
  sets: number
  repetitions: number
  restTime: number
  exerciseTechnique: string
  createdAt: Date
  updatedAt?: Date
}

export class WorkoutPlanExercise extends Entity<WorkoutPlanExerciseProps> {
  get workoutPlanId() {
    return this.props.workoutPlanId
  }

  get exerciseId() {
    return this.props.exerciseId
  }

  get sets() {
    return this.props.sets
  }

  get repetitions() {
    return this.props.repetitions
  }

  get restTime() {
    return this.props.restTime
  }

  get exerciseTechnique() {
    return this.props.exerciseTechnique ?? undefined
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set sets(sets: number) {
    this.props.sets = sets
    this.touch()
  }

  set repetitions(repetitions: number) {
    this.props.repetitions = repetitions
    this.touch()
  }

  set restTime(restTime: number) {
    this.props.restTime = restTime
    this.touch()
  }

  set exerciseTechnique(exerciseTechnique: string) {
    this.props.exerciseTechnique = exerciseTechnique
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      WorkoutPlanExerciseProps,
      'createdAt' | 'exerciseTechnique'
    >,
    id?: UniqueEntityID,
  ) {
    const workoutPlanExercise = new WorkoutPlanExercise(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        exerciseTechnique: props.exerciseTechnique ?? 'SEM TÉCNICA',
      },
      id,
    )

    return workoutPlanExercise
  }
}
