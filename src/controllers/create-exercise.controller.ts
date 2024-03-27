import { Controller, Post } from '@nestjs/common'
import { Roles } from 'src/auth/authorization/roles.decorator'
import { CurrentUser } from 'src/auth/current-user.decorator'

import { UserPayload } from 'src/auth/jwt.strategy'
import { Role } from 'src/utils/enums/roles.enum'

@Controller('/exercises')
export class CreateExerciseController {
  constructor() {}

  @Post()
  @Roles(Role.Professional)
  async handle(@CurrentUser() user: UserPayload) {
    return user
  }
}
