import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserProfile } from './user-profile'

export interface UserProps {
  email: string
  password: string
  firstTimeLogin?: boolean
  userProfile?: UserProfile
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

  get firstTimeLogin() {
    return this.props.firstTimeLogin
  }

  get userProfile() {
    return this.props.userProfile
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

  set firstTimeLogin(firstTimeLogin: boolean | undefined) {
    this.props.firstTimeLogin = firstTimeLogin
    this.touch()
  }

  set userProfile(userProfile: UserProfile | undefined) {
    this.props.userProfile = userProfile
    this.touch()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'userProfile'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        userProfile: props.userProfile ?? undefined,
        firstTimeLogin: props.firstTimeLogin ?? true,
      },
      id,
    )
    return user
  }
}
