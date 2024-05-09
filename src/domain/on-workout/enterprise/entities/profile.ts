import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from './user'

export interface ProfileProps {
  userId: UniqueEntityID
  user: User
  firstName: string
  lastName: string
  avatar?: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Profile<
  Props extends ProfileProps,
> extends Entity<Props> {
  get userId() {
    return this.props.userId
  }

  get user() {
    return this.props.user
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get avatar() {
    return this.props.avatar
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

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
    this.touch()
  }

  set user(user: User) {
    this.props.user = user
    this.touch()
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName
    this.touch()
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName
    this.touch()
  }

  set avatar(avatar: string | undefined) {
    this.props.avatar = avatar
    this.touch()
  }
}
