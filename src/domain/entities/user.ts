import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface IUserProps {
  email: string
  password: string
  profileId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<IUserProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
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

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  static create(props: Optional<IUserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return user
  }
}
