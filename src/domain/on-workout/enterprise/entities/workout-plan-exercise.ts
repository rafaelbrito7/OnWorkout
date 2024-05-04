import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface WorkoutPlanExerciseProps {
  workoutPlanId: UniqueEntityID
  exerciseId: UniqueEntityID
  sets: number
  repetitions: number
  intervalBetweenSets: number
  exerciseTechnique?: string
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

  get intervalBetweenSets() {
    return this.props.intervalBetweenSets
  }

  get exerciseTechnique() {
    return this.props.exerciseTechnique
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

  set intervalBetweenSets(intervalBetweenSets: number) {
    this.props.intervalBetweenSets = intervalBetweenSets
    this.touch()
  }

  set exerciseTechnique(exerciseTechnique: string | undefined) {
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
        exerciseTechnique: props.exerciseTechnique ?? undefined,
      },
      id,
    )

    return workoutPlanExercise
  }
}
