import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'

import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      email: 'john.doe@email.com',
      password: 'RandomPassword123',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'PROFESSIONAL', // or 'ATHLETE'
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
