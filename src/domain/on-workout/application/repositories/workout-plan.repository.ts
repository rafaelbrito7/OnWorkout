import { WorkoutPlan } from '../../enterprise/entities/workout-plan'

export interface WorkoutPlanRepository {
  findManyByProfessionalId(workoutPlanId: string): Promise<WorkoutPlan[]>
  findById(workoutPlanId: string): Promise<WorkoutPlan | null>
  create(workoutPlan: WorkoutPlan): Promise<void>
  save(workoutPlan: WorkoutPlan): Promise<void>
  delete(workoutPlan: WorkoutPlan): Promise<void>
}
