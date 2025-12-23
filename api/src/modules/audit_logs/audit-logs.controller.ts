import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { CreateAuditLogSchema } from './schemas/create-audit-log.schema';
import { SessionGuard } from '../auth/guards/session.guard';

@UseGuards(SessionGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll() {
    return this.auditLogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogsService.findOne(id);
  }

  @Post()
  async create(@Body() createAuditLogDto: CreateAuditLogDto) {
    const { error, value } = CreateAuditLogSchema.validate(createAuditLogDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.auditLogsService.create(value);
  }
}
