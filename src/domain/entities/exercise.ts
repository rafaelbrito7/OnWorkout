import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface IExerciseProps {
  name: string
  description: string
  createdById?: UniqueEntityID
  trainingExercises: UniqueEntityID[]
  createdAt: Date
  updatedAt?: Date
}

export class Exercise extends Entity<IExerciseProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdById() {
    return this.props.createdById
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
    props: Optional<IExerciseProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const exercise = new Exercise(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return exercise
  }
}
