import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('event', { name: 'event' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  dname: string;
  @Column()
  description: string;
  @Column()
  time: Date;
  @Column()
  address: string;
  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: /*['update', 'insert']*/ true,
  })
  attendees: Attendee[];
}
