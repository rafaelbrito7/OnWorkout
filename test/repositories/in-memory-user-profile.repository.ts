import { UserProfileRepository } from '@/domain/on-workout/application/repositories/user-profile.repository'
import { UserProfile } from '@/domain/on-workout/enterprise/entities/user-profile'

export class InMemoryUserProfileRepository implements UserProfileRepository {
  public items: UserProfile[] = []

  async findByUserId(userId: string) {
    return this.items.find((item) => item.userId.toString() === userId) || null
  }

  async create(userProfile: UserProfile) {
    this.items.push(userProfile)
  }

  async save(userProfile: UserProfile): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === userProfile.id)

    this.items[itemIndex] = userProfile
  }

  async delete(userProfile: UserProfile) {
    const itemIndex = this.items.findIndex((item) => item.id === userProfile.id)

    this.items.splice(itemIndex, 1)
  }
}
