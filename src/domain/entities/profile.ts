import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Role } from '@/utils/enums/roles.enum'

interface IProfileProps {
  firstName: string
  lastName: string
  role: Role
  avatar?: string
  userId: UniqueEntityID
  professionalId?: UniqueEntityID
  athleteId?: UniqueEntityID
  exercises: UniqueEntityID[]
  createdAt: Date
  updatedAt?: Date
}

export class Profile extends Entity<IProfileProps> {
  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get role() {
    return this.props.role
  }

  get roleInformation() {
    const { role, professionalId, athleteId } = this.props
    const roleId =
      this.props.role === Role.Professional ? professionalId : athleteId
    return { role, roleId }
  }

  get avatar() {
    return this.props.avatar
  }

  get userId() {
    return this.props.userId
  }

  get exercises() {
    return this.props.exercises
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
    props: Optional<IProfileProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const profile = new Profile(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return profile
  }
}
