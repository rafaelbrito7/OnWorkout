import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProfessionalProfile } from '../entities/professional-profile'
import { Role } from '@/utils/enums/roles.enum'
import { UserProfile, UserProfileProps } from '../entities/user-profile'

export function makeUserProfile(
  override: Partial<UserProfileProps> = {},
  id?: UniqueEntityID,
) {
  const userProfile = UserProfile.create(
    {
      userId: new UniqueEntityID(),
      profileId: new UniqueEntityID(),
      profile: ProfessionalProfile.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.image.avatar(),
      }),
      role: override.role ?? Role.Professional,
      ...override,
    },
    id,
  )

  return userProfile
}
