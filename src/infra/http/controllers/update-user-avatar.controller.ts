import { Body, Controller, HttpCode, Patch } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updateUserAvatarBodySchema = z.object({
  avatar: z.string().url({ message: 'Invalid URL format' }),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserAvatarBodySchema)

type UpdateUserAvatarBodySchema = z.infer<typeof updateUserAvatarBodySchema>

// TODO incomplete controller needs BLOB and image upload handling
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
