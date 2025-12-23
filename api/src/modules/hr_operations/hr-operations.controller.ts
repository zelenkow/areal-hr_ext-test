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
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { CreateHrOperationSchema } from './schemas/create-hr-operation.schema';
import { SessionGuard } from '../auth/guards/session.guard';

@UseGuards(SessionGuard)
@Controller('hr-operations')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.hrOperationsService.findByEmployeeId(employeeId);
  }

  @Post()
  async create(@Body() createHrOperationDto: CreateHrOperationDto) {
    const { error, value } =
      CreateHrOperationSchema.validate(createHrOperationDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.hrOperationsService.create(value);
  }
}
