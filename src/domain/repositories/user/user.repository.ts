import { PrismaService } from '@/infra/prisma/prisma.service'
import { IUserRepository } from './user-repository.interface'
import { UpdateProfileBodySchema } from '@/infra/http/controllers/update-profile.controller'
import { CreateUserBodySchema } from '@/infra/http/controllers/create-user.controller'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserBodySchema) {
    await this.prismaService.user.create({
      data: {
        email: user.email,
        password: user.password,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: user.role,
          },
        },
      },
    })
  }

  async getOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
  }

  async updatePassword(password: string, userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
        updatedAt: new Date(),
      },
    })
  }

  async updateProfile(updatedProfile: UpdateProfileBodySchema, userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email: updatedProfile.email,
        profile: {
          update: {
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            updatedAt: new Date(),
          },
        },
        updatedAt: new Date(),
      },
    })
  }

  async updateAvatar(avatarUrl: string, userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            avatar: avatarUrl,
            updatedAt: new Date(),
          },
        },
      },
    })
  }
}
