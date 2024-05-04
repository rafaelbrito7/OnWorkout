import { Exercise } from '../../enterprise/entities/exercise'

export interface CustomExerciseRepository {
  findManyByProfessionalId(professionalId: string): Promise<Exercise[]>
  findById(id: string): Promise<Exercise | undefined>
  create(exercise: Exercise): Promise<void>
  save(exercise: Exercise): Promise<void>
  delete(exercise: Exercise): Promise<void>
}
