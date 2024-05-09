import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '../entities/user'
import { Role } from '@/utils/enums/roles.enum'
import { hashSync } from 'bcryptjs'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      password: hashSync(faker.internet.password()),
      role: Role.Admin,
      ...override,
    },
    id,
  )

  return user
}
