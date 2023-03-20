import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../db/prisma';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  async verifyUser(email: string, password: string) {
    const user = await this.findOneByEmail(email);

    if (await compare(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials were provided');
  }

  async findOneByEmail(email: string) {
    return prisma.user
      .findUniqueOrThrow({
        where: { email },
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid credentials were provided');
      });
  }
}
