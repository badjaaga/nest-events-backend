import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'time', 'description'],
      where: [
        {
          id: MoreThan(3),
          time: MoreThan(new Date('2021-02-12T13:00:00')),
        },

        { description: Like('%buy%') },
      ],
      take: 4,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id) {
    console.log(typeof id);
    return await this.repository.findOne(id);
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    await this.repository.save({
      ...input,
      time: new Date(input.time),
    });
    return 'Some data created';
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);
    return await this.repository.save({
      ...event,
      ...input,
      time: input.time ? new Date(input.time) : event.time,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOne(id);
    await this.repository.remove(event);
  }
}
