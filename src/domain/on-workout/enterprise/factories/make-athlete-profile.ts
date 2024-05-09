import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AthleteProfile,
  AthleteProfileProps,
} from '../entities/athlete-profile'
import { Role } from '@/utils/enums/roles.enum'
import { makeUser } from './make-user'

export function makeAthleteProfile(
  override: Partial<AthleteProfileProps> = {},
  id?: UniqueEntityID,
) {
  const user = makeUser({
    role: Role.Athlete,
  })

  const athleteProfile = AthleteProfile.create(
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

  return athleteProfile
}
