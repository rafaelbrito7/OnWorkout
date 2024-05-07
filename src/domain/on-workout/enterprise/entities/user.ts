import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { Role } from '@/utils/enums/roles.enum'
import { ProfessionalProfile } from './professional-profile'
import { AthleteProfile } from './athlete-profile'

export interface UserProps<T extends AthleteProfile | ProfessionalProfile> {
  email: string
  password: string
  role: Role
  firstTimeLogin: boolean
  profileId: UniqueEntityID
  profile: T
  createdAt: Date
  updatedAt?: Date
}

export class User<
  T extends AthleteProfile | ProfessionalProfile,
> extends AggregateRoot<UserProps<T>> {
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

  get profileId() {
    return this.props.profileId
  }

  get profile() {
    return this.profile
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

  set profileId(profileId: UniqueEntityID) {
    this.props.profileId = profileId
    this.touch()
  }

  set profile(profile: T) {
    this.props.profile = profile
    this.touch()
  }

  isProfessional() {
    return this.role === Role.Professional
  }

  isAthlete() {
    return this.role === Role.Athlete
  }

  static create<T extends AthleteProfile | ProfessionalProfile>(
    props: Optional<UserProps<T>, 'createdAt' | 'firstTimeLogin'>,
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
