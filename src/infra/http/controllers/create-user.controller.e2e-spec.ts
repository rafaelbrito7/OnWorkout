import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { Role } from '@/utils/enums/roles.enum'
import { INestApplication } from '@nestjs/common'

import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()

    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: await hash('RandomP@ss123', 8),
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'Admin',
            role: Role.Admin,
          },
        },
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'admin@admin.com',
      password: 'RandomP@ss123',
    })

    accessToken = response.body.access_token
  })

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john.doe@email.com',
        password: 'R@ndomPassword1',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.Professional,
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@email.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
