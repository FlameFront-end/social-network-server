import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as express from 'express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ credentials: true, origin: true })

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))

  const config = new DocumentBuilder()
    .setTitle('Social network')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  await app.listen(3000)

  console.log('http://localhost:3000/swagger')
}
bootstrap()
