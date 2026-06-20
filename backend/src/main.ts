import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.BACKOFFICE_URL || 'http://localhost:3002',
      ],
      credentials: true,
    },
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())

  const config = new DocumentBuilder()
    .setTitle('JobFinder API')
    .setDescription('Job Board Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)
  Logger.log(`Backend running on port ${port}`, 'Bootstrap')
}
bootstrap()
