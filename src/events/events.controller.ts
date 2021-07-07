import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  @Get()
  async findAll() {
    this.logger.log(`Hit the FindAll route`);
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
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

  @Get('/practice2')
  async practice2() {
    /*const event = await this.repository.findOne(7);*/
    const event = new Event();
    event.id = 1;
    const attendee = new Attendee();
    attendee.name = 'Hue the First';
    attendee.event = event;
    await this.attendeeRepository.save(attendee);
    return event;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    /* console.log(typeof id);*/
    const event = await this.repository.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
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
