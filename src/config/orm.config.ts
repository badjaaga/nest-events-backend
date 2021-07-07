import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from "../events/event.entity";
import { Attendee } from "../events/attendee.entity";
import { registerAs } from '@nestjs/config';
import { Subject } from "../school/subject.entity";
import { Teacher } from "../school/teacher.entity";

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Subject, Teacher],
    synchronize: true,
  }),
);
