import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/auth/authorization/roles.decorator'
import { CurrentUser } from '@/auth/current-user.decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Role } from '@/utils/enums/roles.enum'
import { z } from 'zod'

const createExerciseBodySchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Exercise name must have at least 4 characters.' }),
  description: z
    .string()
    .min(10, {
      message: 'Exercise description must have at least 10 characters.',
    })
    .max(50, {
      message: 'Exercise description must have at most 50 characters.',
    }),
})

const bodyValidationPipe = new ZodValidationPipe(createExerciseBodySchema)

type CreateExerciseBodySchema = z.infer<typeof createExerciseBodySchema>

@Controller('/exercises')
export class CreateExerciseController {
  constructor(private prisma: PrismaService) {}

  @Roles(Role.Professional)
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateExerciseBodySchema,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { name, description } = body
    const exerciseWithSameName = await this.prisma.exercise.findUnique({
      where: {
        name,
      },
    })

    if (exerciseWithSameName) {
      throw new ConflictException('Exercise with same name already exists!')
    }
    const currentUserProfile = await this.prisma.profile.findUnique({
      where: {
        userId: currentUser.sub,
      },
    })
    console.log(currentUserProfile)
    await this.prisma.exercise.create({
      data: {
        name,
        description,
        createdBy: {
          connect: {
            id: currentUserProfile?.id,
          },
        },
      },
    })
  }
}
