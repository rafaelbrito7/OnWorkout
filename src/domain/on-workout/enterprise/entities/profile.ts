import { Entity } from '@/core/entities/entity'

export interface ProfileProps {
  firstName: string
  lastName: string
  avatar?: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Profile<
  Props extends ProfileProps,
> extends Entity<Props> {
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
