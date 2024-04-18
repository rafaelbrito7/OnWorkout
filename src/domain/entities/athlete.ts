import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface IAthleteProps {
  trainingId: UniqueEntityID
  profileId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Athlete extends Entity<IAthleteProps> {
  get training() {
    return this.props.trainingId
  }

  get profileId() {
    return this.props.profileId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<IAthleteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const athlete = new Athlete(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return athlete
  }
}
