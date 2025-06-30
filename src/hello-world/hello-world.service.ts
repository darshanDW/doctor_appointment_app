import { Injectable } from '@nestjs/common';

@Injectable()

export class HelloWorldService {
  getMessage(): string {
    return 'Hello  from  HelloWorld Module!';
  }
}

