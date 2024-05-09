import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Profile, ProfileProps } from './profile'
import { WorkoutPlanList } from './workout-plan-list'

export interface ProfessionalProfileProps extends ProfileProps {
  workoutPlans: WorkoutPlanList
  createdAt: Date
  updatedAt?: Date
}

export class ProfessionalProfile extends Profile<ProfessionalProfileProps> {
  get workoutPlans() {
    return this.props.workoutPlans
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set workoutPlans(workoutPlans: WorkoutPlanList) {
    this.props.workoutPlans = workoutPlans
  }

  static create(
    props: Optional<ProfessionalProfileProps, 'workoutPlans' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const professionalProfile = new ProfessionalProfile(
      {
        ...props,
        workoutPlans: props.workoutPlans ?? new WorkoutPlanList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return professionalProfile
  }
}
