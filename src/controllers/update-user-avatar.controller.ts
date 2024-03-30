import { Body, Controller, HttpCode, Patch } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { UserPayload } from 'src/auth/jwt.strategy'

const updateUserAvatarBodySchema = z.object({
  avatar: z.string().url({ message: 'Invalid URL format' }),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserAvatarBodySchema)

type UpdateUserAvatarBodySchema = z.infer<typeof updateUserAvatarBodySchema>

@Controller('/users/avatar')
export class UpdateUserAvatarController {
  constructor(private prisma: PrismaService) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserAvatarBodySchema,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { avatar } = body

    await this.prisma.user.update({
      where: {
        id: currentUser.sub,
      },
      data: {
        profile: {
          update: {
            avatar,
          },
        },
      },
    })
  }
}
