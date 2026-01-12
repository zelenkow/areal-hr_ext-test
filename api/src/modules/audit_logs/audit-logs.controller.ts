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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.guard';

@Controller('audit-logs')
@UseGuards(SessionGuard, RolesGuard)
@Roles('admin')
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

  @Get(':id/diff')
  async getLogWithDiff(@Param('id') id: number) {
    return this.auditLogsService.findOneWithDiff(id);
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
