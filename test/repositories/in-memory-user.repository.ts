import { User } from '@/domain/on-workout/enterprise/entities/user'
import { UserRepository } from '@/domain/on-workout/application/repositories/user.repository'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  constructor() {}

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null
  }

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items.splice(itemIndex, 1)
  }
}
