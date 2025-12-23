import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateFileSchema } from './schemas/create-file.schema';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Response } from 'express';
import { SessionGuard } from '../auth/guards/session.guard';

@UseGuards(SessionGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('employee/:employeeId')
  async getEmployeeFiles(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.filesService.findByEmployeeId(employeeId);
  }

  @Get(':id/download')
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const file = await this.filesService.findOne(id);

    const filePath = join(process.cwd(), file.file_path);

    return res.download(filePath);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Body() createFileDto: CreateFileDto,
  ) {
    const { error, value } = CreateFileSchema.validate(createFileDto);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    const fileName = extension ? `${timestamp}.${extension}` : `${timestamp}`;

    const uploadsRoot = join(process.cwd(), 'uploads');
    const employeeDir = join(uploadsRoot, value.employee_id.toString());

    if (!existsSync(employeeDir)) {
      mkdirSync(employeeDir, { recursive: true });
    }

    const targetPath = join(employeeDir, fileName);
    writeFileSync(targetPath, file.buffer);

    const dbFilePath = `/uploads/${value.employee_id}/${fileName}`;
    return this.filesService.create({
      ...value,
      file_path: dbFilePath,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
