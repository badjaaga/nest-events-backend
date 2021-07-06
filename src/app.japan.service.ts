import { Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  getHello(): string {
    return 'こんにちは世界!';
  }
}
