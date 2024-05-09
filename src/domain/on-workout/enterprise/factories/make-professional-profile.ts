import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ProfessionalProfile,
  ProfessionalProfileProps,
} from '../entities/professional-profile'
import { Role } from '@/utils/enums/roles.enum'
import { makeUser } from './make-user'

export function makeProfessionalProfile(
  override: Partial<ProfessionalProfileProps> = {},
  id?: UniqueEntityID,
) {
  const user = makeUser({
    role: Role.Professional,
  })

  const professionalProfile = ProfessionalProfile.create(
    {
      userId: user.id,
      user,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
      ...override,
    },
    id,
  )

  return professionalProfile
}
