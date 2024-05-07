import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'

export interface WorkoutPlanExerciseRepository {
  findById(workoutPlanExerciseId: string): Promise<WorkoutPlanExercise | null>
  create(workoutPlanExercise: WorkoutPlanExercise): Promise<void>
  save(workoutPlanExercise: WorkoutPlanExercise): Promise<void>
  delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void>
}
