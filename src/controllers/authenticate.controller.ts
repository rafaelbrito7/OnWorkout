import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { Public } from '@/auth/skip-auth.decorator'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must have at least 6 characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/, {
      message:
        'Password must have at least one uppercase letter, one lowercase letter, and one number',
    }),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Public()
  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials!')
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
      role: user.profile?.role,
    })

    return {
      access_token: accessToken,
    }
  }
}
