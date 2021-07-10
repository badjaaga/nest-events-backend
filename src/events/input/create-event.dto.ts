import { IsDateString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(5, 255, { message: 'The name is too short. Type longer name' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  time: Date;
  @Length(5, 255)
  address: string;
}
