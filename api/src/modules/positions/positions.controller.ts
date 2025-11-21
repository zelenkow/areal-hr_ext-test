import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './interfaces/position.interface';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return this.positionsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    return this.positionsService.create(createPositionDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return this.positionsService.remove(id);
  }
}
