import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface IProfessionalProps {
  trainings: UniqueEntityID[]
  profileId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Professional extends Entity<IProfessionalProps> {
  get trainings() {
    return this.props.trainings
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
    props: Optional<IProfessionalProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const professional = new Professional(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return professional
  }
}
