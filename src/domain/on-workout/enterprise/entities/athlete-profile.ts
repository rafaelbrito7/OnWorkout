import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Profile, ProfileProps } from './profile'

export interface AthleteProfileProps extends ProfileProps {
  createdAt: Date
  updatedAt?: Date
}

export class AthleteProfile extends Profile<AthleteProfileProps> {
  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<AthleteProfileProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const athleteProfile = new AthleteProfile(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return athleteProfile
  }
}
