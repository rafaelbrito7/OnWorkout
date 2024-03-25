import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/exercises')
@UseGuards(JwtAuthGuard)
export class CreateExerciseController {
  constructor() {}

  @Post()
  async handle() {
    return 'ok'
  }
}
