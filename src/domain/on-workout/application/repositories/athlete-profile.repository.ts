import { AthleteProfile } from '../../enterprise/entities/athlete-profile'

export interface AthleteProfileRepository {
  findById(athleteProfileId: string): Promise<AthleteProfile | null>
  findByUserId(userId: string): Promise<AthleteProfile | null>
  create(athleteProfile: AthleteProfile): Promise<void>
  save(athleteProfile: AthleteProfile): Promise<void>
  delete(athleteProfile: AthleteProfile): Promise<void>
}
