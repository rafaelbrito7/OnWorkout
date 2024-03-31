import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Role } from '@/utils/enums/roles.enum'
import { Public } from '@/infra/auth/skip-auth.decorator'

const createUserBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must have at least 6 characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/, {
      message:
        'Password must have at least one uppercase letter, one lowercase letter, and one number',
    }),
  firstName: z
    .string()
    .min(1, { message: 'First name must have at least 1 character' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name must have at least 1 character' }),
  avatar: z.string().url().optional(),
  userType: z.enum([Role.Admin, Role.Professional, Role.Athlete]),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
export class CreateUserController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { email, password, firstName, lastName, avatar, userType } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists!')
    }

    const hashedPassword = await hash(password, 8)

    if (userType === 'PROFESSIONAL') {
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: {
            create: {
              firstName,
              lastName,
              avatar,
              role: userType,
              professional: {
                create: {},
              },
            },
          },
        },
      })
    }

    if (userType === 'ATHLETE') {
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: {
            create: {
              firstName,
              lastName,
              avatar,
              role: userType,
              athlete: {
                create: {},
              },
            },
          },
        },
      })
    }
  }
}
