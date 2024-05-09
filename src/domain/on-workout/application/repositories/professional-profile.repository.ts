import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'

export interface ProfessionalProfileRepository {
  findById(professionalProfileId: string): Promise<ProfessionalProfile | null>
  findByUserId(userId: string): Promise<ProfessionalProfile | null>
  create(professionalProfile: ProfessionalProfile): Promise<void>
  save(professionalProfile: ProfessionalProfile): Promise<void>
  delete(professionalProfile: ProfessionalProfile): Promise<void>
}
