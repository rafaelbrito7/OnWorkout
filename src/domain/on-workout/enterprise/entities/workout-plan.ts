import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { WorkoutPlanExerciseList } from './workout-plan-exercise-list'

export interface WorkoutPlanProps {
  professionalId: UniqueEntityID
  athleteId: UniqueEntityID
  workoutPlanExercises: WorkoutPlanExerciseList
  expirationDate: Date
  isExpired?: boolean
  createdAt: Date
  updatedAt?: Date
}

export class WorkoutPlan extends AggregateRoot<WorkoutPlanProps> {
  get professionalId() {
    return this.props.professionalId
  }

  get athleteId() {
    return this.props.athleteId
  }

  get workoutPlanExercises() {
    return this.props.workoutPlanExercises
  }

  get expirationDate() {
    return this.props.expirationDate
  }

  get isExpired() {
    return this.props.isExpired
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set expirationDate(expirationDate: Date) {
    this.props.expirationDate = expirationDate
    this.touch()
  }

  set isExpired(isExpired: boolean | undefined) {
    this.props.isExpired = isExpired
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      WorkoutPlanProps,
      'createdAt' | 'isExpired' | 'workoutPlanExercises'
    >,
    id?: UniqueEntityID,
  ) {
    const workoutPlan = new WorkoutPlan(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isExpired: props.isExpired ?? false,
        workoutPlanExercises:
          props.workoutPlanExercises ?? new WorkoutPlanExerciseList([]),
      },
      id,
    )

    return workoutPlan
  }
}
