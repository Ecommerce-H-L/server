import { Global, Module } from '@nestjs/common';

import { PrismaService } from './services/prisma/prisma.service';

const services = [PrismaService];

@Global()
@Module({ providers: services, exports: services })
export class CommonModule {}
