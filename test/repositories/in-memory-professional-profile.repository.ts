import { ProfessionalProfileRepository } from '@/domain/on-workout/application/repositories/professional-profile.repository'
import { ProfessionalProfile } from '@/domain/on-workout/enterprise/entities/professional-profile'

export class InMemoryProfessionalProfileRepository
  implements ProfessionalProfileRepository
{
  public items: ProfessionalProfile[] = []

  async findById(
    professionalProfileId: string,
  ): Promise<ProfessionalProfile | null> {
    return (
      this.items.find((item) => item.id.toString() === professionalProfileId) ||
      null
    )
  }

  async findByUserId(userId: string) {
    return this.items.find((item) => item.userId.toString() === userId) || null
  }

  async create(professionalProfile: ProfessionalProfile) {
    this.items.push(professionalProfile)
  }

  async save(professionalProfile: ProfessionalProfile): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === professionalProfile.id,
    )

    this.items[itemIndex] = professionalProfile
  }

  async delete(professionalProfile: ProfessionalProfile) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === professionalProfile.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
