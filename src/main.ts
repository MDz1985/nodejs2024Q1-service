import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './services/logging/logging.service';
import { LogLevel } from './common/enums/log-level';

config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);

  const config = new DocumentBuilder()
    .setTitle('Home Library API')
    .setDescription('The Home Library API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    loggingService.logMessage(error.message, LogLevel.ERROR);
    // todo: remove if doesn't need
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.logMessage(
      `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      LogLevel.ERROR,
    );
    // loggingService.logError(
    //   new Error(`Unhandled Rejection at: ${ promise }, reason: ${ reason }`),
    // );
  });
  await app.listen(PORT);
  console.log(PORT, 'port is running');
}

bootstrap();
