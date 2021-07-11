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
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { CreateEventDto } from './input/create-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { ListEvents } from './input/list.events';
import { EventService } from './event.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter);
    this.logger.log(`Hit the FindAll route`);
    return await this.eventsService.getEventWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 10,
      },
    );
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
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    await this.eventsService.createEvent(input, user);
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
    const result = await this.eventsService.deleteEvent(id);

    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
