import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Profile, ProfileProps } from './profile'

export interface ProfessionalProfileProps extends ProfileProps {
  createdAt: Date
  updatedAt?: Date
}

export class ProfessionalProfile extends Profile<ProfessionalProfileProps> {
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ProfessionalProfileProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const professionalProfile = new ProfessionalProfile(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return professionalProfile
  }
}
