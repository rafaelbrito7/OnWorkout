import { AthleteProfileRepository } from '@/domain/on-workout/application/repositories/athlete-profile.repository'
import { AthleteProfile } from '@/domain/on-workout/enterprise/entities/athlete-profile'

export class InMemoryAthleteProfileRepository
  implements AthleteProfileRepository
{
  public items: AthleteProfile[] = []

  async findById(athleteProfileId: string): Promise<AthleteProfile | null> {
    return (
      this.items.find((item) => item.id.toString() === athleteProfileId) || null
    )
  }

  async findByUserId(userId: string) {
    return this.items.find((item) => item.userId.toString() === userId) || null
  }

  async create(athleteProfile: AthleteProfile) {
    this.items.push(athleteProfile)
  }

  async save(athleteProfile: AthleteProfile): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === athleteProfile.id,
    )

    this.items[itemIndex] = athleteProfile
  }

  async delete(athleteProfile: AthleteProfile) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === athleteProfile.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
