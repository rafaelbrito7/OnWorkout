import { User } from '../entities/user'

export interface IUserRepository {
  create(user: User): Promise<void>
}
