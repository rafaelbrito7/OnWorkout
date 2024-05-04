import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Exercise, ExerciseProps } from '../entities/exercise'

export function makeExercise(
  override: Partial<ExerciseProps> = {},
  id?: UniqueEntityID,
) {
  const exercise = Exercise.create(
    {
      createdById: new UniqueEntityID('user-profile-id'),
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return exercise
}
