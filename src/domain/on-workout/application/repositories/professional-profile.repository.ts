import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'

export interface ProfessionalProfileRepository {
  findById(professionalprofileId: string): Promise<ProfessionalProfile | null>
  findByEmail(email: string): Promise<ProfessionalProfile | null>
  create(professionalprofile: ProfessionalProfile): Promise<void>
  save(professionalprofile: ProfessionalProfile): Promise<void>
  delete(professionalprofile: ProfessionalProfile): Promise<void>
}
