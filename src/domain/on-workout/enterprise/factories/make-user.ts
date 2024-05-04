import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '../entities/user'
import { ProfessionalProfile } from '../entities/professional-profile'
import { Role } from '@/utils/enums/roles.enum'
import { UserProfile, UserProfileProps } from '../entities/user-profile'
import { hashSync } from 'bcryptjs'

export function makeUser(
  override: Partial<UserProps & UserProfileProps> = {},
  id?: UniqueEntityID,
) {
  const professionalProfile = ProfessionalProfile.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
  })

  if (override.password) {
    const hashedPassword = hashSync(override.password, 10)
    override.password = hashedPassword
  }

  const user = User.create(
    {
      email: faker.internet.email(),
      password: hashSync(faker.internet.password()),
      ...override,
    },
    id,
  )

  const userProfile = UserProfile.create({
    userId: user.id,
    profileId: professionalProfile.id,
    role: override.userProfile?.role ?? Role.Professional,
    profile: professionalProfile,
  })

  user.userProfile = userProfile

  return user
}
