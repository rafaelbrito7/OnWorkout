import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Role } from '@/utils/enums/roles.enum'

export interface UserProps {
  email: string
  password: string
  role: Role
  firstTimeLogin: boolean
  createdAt: Date
  updatedAt?: Date
}

export class User extends AggregateRoot<UserProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get firstTimeLogin() {
    return this.props.firstTimeLogin
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

  set role(role: Role) {
    this.props.role = role
    this.touch()
  }

  set firstTimeLogin(firstTimeLogin: boolean) {
    this.props.firstTimeLogin = firstTimeLogin
    this.touch()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'firstTimeLogin'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        firstTimeLogin: props.firstTimeLogin ?? false,
      },
      id,
    )
    return user
  }
}
