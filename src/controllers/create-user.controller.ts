import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { Role } from 'src/utils/enums/roles.enum'
import { Public } from 'src/auth/skip-auth.decorator'

const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
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
