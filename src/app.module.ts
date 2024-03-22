import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateUserController } from './controllers/create-user.controller'

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [PrismaService],
})
export class AppModule {}
