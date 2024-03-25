import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { CreateUserController } from './controllers/create-user.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateExerciseController } from './controllers/create-exercise.controller'

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
  ],
  providers: [PrismaService],
})
export class AppModule {}
