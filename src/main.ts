import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FAVA')
    .setDescription('The APIs description of FAVA')
    .setVersion('1.1')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Users')
    .addTag('Weather')
    .addTag('Clothes')
    .build();

  app.enableCors({
    origin: '*',// `http://localhost:${process.env.PORT}`, // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    credentials: true, // Allow credentials like cookies
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
