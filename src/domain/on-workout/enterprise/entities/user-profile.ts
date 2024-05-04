import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AthleteProfile } from './athlete-profile'
import { ProfessionalProfile } from './professional-profile'
import { Role } from '@/utils/enums/roles.enum'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface UserProfileProps {
  userId: UniqueEntityID
  profileId: UniqueEntityID
  profile: ProfessionalProfile | AthleteProfile
  role: Role
  createdAt: Date
  updatedAt?: Date
}

export class UserProfile extends AggregateRoot<UserProfileProps> {
  get userId() {
    return this.props.userId
  }

  get profileId() {
    return this.props.profileId
  }

  get role() {
    return this.props.role
  }

  get profile() {
    return this.props.profile
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

  set role(role: Role) {
    this.props.role = role
    this.touch()
  }

  set profile(profile) {
    this.props.profile = profile
    this.touch()
  }

  static create(
    props: Optional<UserProfileProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const userProfile = new UserProfile(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return userProfile
  }
}
