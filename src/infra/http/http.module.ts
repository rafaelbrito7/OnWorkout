import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateExerciseController } from './controllers/create-exercise.controller'
import { CreateUserController } from './controllers/create-user.controller'
import { UpdateProfileController } from './controllers/update-profile.controller'
import { UpdateUserAvatarController } from './controllers/update-user-avatar.controller'
import { UpdateUserPasswordController } from './controllers/update-user-password.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateExerciseController,
    UpdateProfileController,
    UpdateUserPasswordController,
    UpdateUserAvatarController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
