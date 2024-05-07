import { WatchedList } from '@/core/entities/watched-list'
import { WorkoutPlan } from './workout-plan'

export class WorkoutPlanList extends WatchedList<WorkoutPlan> {
  compareItems(a: WorkoutPlan, b: WorkoutPlan): boolean {
    return a.id === b.id
  }
}
