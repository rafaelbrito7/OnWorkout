import { Body, Controller, HttpCode, Patch } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { hash } from 'bcryptjs'

const updateUserPasswordBodySchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must have at least 6 characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/, {
      message:
        'Password must have at least one uppercase letter, one lowercase letter, and one number',
    }),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserPasswordBodySchema)

type UpdateUserPasswordBodySchema = z.infer<typeof updateUserPasswordBodySchema>

@Controller('/users/password')
export class UpdateUserPasswordController {
  constructor(private prisma: PrismaService) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserPasswordBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { password } = body

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.update({
      where: {
        id: user.sub,
      },
      data: {
        password: hashedPassword,
      },
    })
  }
}
