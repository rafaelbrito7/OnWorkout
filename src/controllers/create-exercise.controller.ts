import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { Roles } from 'src/auth/authorization/roles.decorator'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from 'src/utils/enums/roles.enum'
import { z } from 'zod'

const createExerciseBodySchema = z.object({
  name: z.string().min(4),
  description: z.string().min(30),
})

type CreateExerciseBodySchema = z.infer<typeof createExerciseBodySchema>

@Controller('/exercises')
export class CreateExerciseController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @Roles(Role.Professional)
  async handle(
    @Body() body: CreateExerciseBodySchema,
    @CurrentUser() user: UserPayload,
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
        userId: user.sub,
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
