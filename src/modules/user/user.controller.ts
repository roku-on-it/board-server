import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user';
import { prisma } from '../db/prisma';

@Controller('user')
export class UserController {
  @Get('me')
  async getMe(@CurrentUser() user) {
    delete user.password;
    return user;
  }

  @Get('candidates/:id')
  async getProfile(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return prisma.user
      .findFirstOrThrow({
        select: {
          id: true,
          name: true,
          candidateProfile: {
            select: {
              description: true,
              email: true,
              position: true,
              salary: true,
              stack: true,
            },
          },
        },
        where: {
          id,
          candidateProfile: {
            isNot: null,
          },
        },
      })
      .catch((e) => {
        if (e.code === 'P2025') {
          throw new NotFoundException();
        }

        throw e;
      });
  }

  @Get('candidates')
  async getCandidates(@CurrentUser() user) {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        candidateProfile: {
          select: {
            description: true,
            email: true,
            position: true,
            salary: true,
            stack: true,
          },
        },
      },
      where: {
        candidateProfile: {
          isNot: null,
        },
      },
    });
  }
}
