import { CustomExerciseRepository } from '@/domain/on-workout/application/repositories/custom-exercise.repository'
import { Exercise } from '@/domain/on-workout/enterprise/entities/exercise'

export class InMemoryCustomExerciseRepository
  implements CustomExerciseRepository
{
  public items: Exercise[] = []

  async findManyByProfessionalId(professionalId: string): Promise<Exercise[]> {
    return this.items.filter(
      (item) => item.createdById.toString() === professionalId,
    )
  }

  async findById(id: string): Promise<Exercise | undefined> {
    return this.items.find((item) => item.id.toString() === id)
  }

  async create(exercise: Exercise) {
    this.items.push(exercise)
  }

  async save(exercise: Exercise): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === exercise.id)

    this.items[itemIndex] = exercise
  }

  async delete(exercise: Exercise) {
    const itemIndex = this.items.findIndex((item) => item.id === exercise.id)

    this.items.splice(itemIndex, 1)
  }
}
