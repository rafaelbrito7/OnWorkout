import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updateProfileBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  firstName: z
    .string()
    .min(1, { message: 'First name must have at least 1 character' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name must have at least 1 character' }),
})

const bodyValidationPipe = new ZodValidationPipe(updateProfileBodySchema)

type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>

@Controller('/users/profile')
export class UpdateProfileController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: UpdateProfileBodySchema,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { email, firstName, lastName } = body

    if (email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        throw new ConflictException('User with same email already exists!')
      }
    }

    await this.prisma.user.update({
      where: {
        id: currentUser.sub,
      },
      data: {
        email,
        profile: {
          update: {
            firstName,
            lastName,
          },
        },
      },
    })
  }
}
