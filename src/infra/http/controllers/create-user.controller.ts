import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Role } from '@/utils/enums/roles.enum'
import { Roles } from '@/infra/auth/authorization/roles.decorator'
import { UserRepository } from '@/domain/repositories/user/user.repository'

const createUserBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must have at least 6 characters' })
    .max(15, { message: 'Password must have at most 15 characters' })
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
  role: z.enum([Role.Admin, Role.Professional, Role.Athlete]),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
export class CreateUserController {
  constructor(private readonly UserRepository: UserRepository) {}

  @Roles(Role.Admin)
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { email, password, firstName, lastName, avatar, role } = body

    const userWithSameEmail = await this.UserRepository.getOneByEmail(email)

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists!')
    }

    const hashedPassword = await hash(password, 8)

    const profileData = {
      firstName,
      lastName,
      avatar,
      role,
    }

    if (role === Role.Professional || role === Role.Athlete) {
      profileData[role] = { create: {} }

      const newUser: CreateUserBodySchema = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
        role,
      }

      await this.UserRepository.create(newUser)
    }
  }
}
