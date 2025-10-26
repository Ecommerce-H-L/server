import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('/healthz')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', enum: ['ok'] } },
    },
  })
  liveness() {
    return { status: 'ok' as const };
  }

  @Get('/readyz')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', enum: ['ok'] } },
    },
  })
  readiness() {
    return { status: 'ok' as const };
  }
}
