import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { CreateUserController } from './controllers/create-user.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateExerciseController } from './controllers/create-exercise.controller'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { RolesGuard } from './auth/authorization/roles.guard'
import { UpdateProfileController } from './controllers/update-profile.controller'
import { UpdateUserPasswordController } from './controllers/update-user-password.controller'
import { UpdateUserAvatarController } from './controllers/update-user-avatar.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateExerciseController,
    UpdateProfileController,
    UpdateUserPasswordController,
    UpdateUserAvatarController,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
