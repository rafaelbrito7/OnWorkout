import { AthleteProfile } from '../../enterprise/entities/athlete-profile'

export interface AthleteProfileRepository {
  findById(athleteprofileId: string): Promise<AthleteProfile | null>
  findByEmail(email: string): Promise<AthleteProfile | null>
  create(athleteprofile: AthleteProfile): Promise<void>
  save(athleteprofile: AthleteProfile): Promise<void>
  delete(athleteprofile: AthleteProfile): Promise<void>
}
