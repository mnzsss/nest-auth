/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { fastify } from 'fastify';
import fastifyCookie from 'fastify-cookie';

const fastifyInstance = fastify();

fastifyInstance.addHook('onRequest', (request, reply, done) => {
  // @ts-ignore
  reply.setHeader = function (key, value) {
    return this.raw.setHeader(key, value);
  };
  // @ts-ignore
  reply.end = function () {
    this.raw.end();
  };
  // @ts-ignore
  request.res = reply;
  done();
});

(async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  app.register(fastifyCookie, {
    secret: process.env.APP_SECRET,
  });

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
})();
