import { Exercise } from '../../enterprise/entities/exercise'

export interface ExerciseRepository {
  findMany(): Promise<Exercise[]>
  create(exercise: Exercise): Promise<void>
  save(exercise: Exercise): Promise<void>
  delete(exercise: Exercise): Promise<void>
}
