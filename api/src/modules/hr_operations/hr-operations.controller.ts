import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { CreateHrOperationSchema } from './schemas/create-hr-operation.schema';
import { UpdateHrOperationSchema } from './schemas/update-hr-operation.schema';

@Controller('hr-operations')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Get()
  async findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHrOperationDto: UpdateHrOperationDto,
  ) {
    const { error, value } =
      UpdateHrOperationSchema.validate(updateHrOperationDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.hrOperationsService.update(id, value);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.remove(id);
  }
}
