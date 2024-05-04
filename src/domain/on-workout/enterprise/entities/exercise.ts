import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ExerciseProps {
  name: string
  description: string
  createdById: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Exercise extends Entity<ExerciseProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdById() {
    return this.props.createdById
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set createdById(createdById: UniqueEntityID) {
    this.props.createdById = createdById
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ExerciseProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const exercise = new Exercise(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return exercise
  }
}
