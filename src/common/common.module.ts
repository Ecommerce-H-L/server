import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { HashingService, PrismaService } from './services';
import { TokenService } from './services/token.service';

const services = [PrismaService, HashingService, TokenService, JwtService];

@Global()
@Module({
  providers: services,
  exports: services,
  imports: [JwtModule],
})
export class CommonModule {}
