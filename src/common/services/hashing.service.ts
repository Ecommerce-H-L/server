import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

const saltRound = 10;

@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt(saltRound);
    return hash(data, salt);
  }

  compare(data: string, hashed: string): Promise<boolean> {
    return compare(data, hashed);
  }
}
