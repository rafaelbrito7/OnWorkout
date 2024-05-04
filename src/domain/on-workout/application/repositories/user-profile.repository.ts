import { UserProfile } from '../../enterprise/entities/user-profile'

export interface UserProfileRepository {
  findByUserId(userProfileId: string): Promise<UserProfile | null>
  create(userProfile: UserProfile): Promise<void>
  save(userProfile: UserProfile): Promise<void>
  delete(userProfile: UserProfile): Promise<void>
}
