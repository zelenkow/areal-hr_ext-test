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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UpdateUserSchema } from './schemas/update-user.schema';
import { SessionGuard } from '../auth/guards/session.guard';

@UseGuards(SessionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { error, value } = CreateUserSchema.validate(createUserDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.usersService.create(value);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { error, value } = UpdateUserSchema.validate(updateUserDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    return this.usersService.update(id, value);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
