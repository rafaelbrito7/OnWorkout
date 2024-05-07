import { AthleteProfile } from '../../enterprise/entities/athlete-profile'
import { ProfessionalProfile } from '../../enterprise/entities/professional-profile'
import { User } from '../../enterprise/entities/user'

export interface UserRepository<> {
  findById(
    userId: string,
  ): Promise<User<AthleteProfile | ProfessionalProfile> | null>
  findByEmail(
    email: string,
  ): Promise<User<AthleteProfile | ProfessionalProfile> | null>
  create(user: User<AthleteProfile | ProfessionalProfile>): Promise<void>
  save(user: User<AthleteProfile | ProfessionalProfile>): Promise<void>
  delete(user: User<AthleteProfile | ProfessionalProfile>): Promise<void>
}
