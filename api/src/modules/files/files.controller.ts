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
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CreateFileSchema } from './schemas/create-file.schema';
import { UpdateFileSchema } from './schemas/update-file.schema';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    const { error, value } = CreateFileSchema.validate(createFileDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.filesService.create(value);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    const { error, value } = UpdateFileSchema.validate(updateFileDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    return this.filesService.update(id, value);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
