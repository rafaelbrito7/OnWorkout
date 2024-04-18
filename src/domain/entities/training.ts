import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface ITrainingProps {
  duration: string
  isExpired: boolean
  professionalId?: UniqueEntityID
  athleteId: UniqueEntityID
  trainingExercises: UniqueEntityID[]
  createdAt: Date
  updatedAt?: Date
}

export class Training extends Entity<ITrainingProps> {
  get duration() {
    return this.props.duration
  }

  get isExpired() {
    return this.props.isExpired
  }

  get professionalId() {
    return this.props.professionalId
  }

  get athleteId() {
    return this.props.athleteId
  }

  get trainingExercises() {
    return this.props.trainingExercises
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
    props: Optional<ITrainingProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const training = new Training(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return training
  }
}
