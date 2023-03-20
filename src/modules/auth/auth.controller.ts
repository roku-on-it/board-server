import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { prisma } from '../db/prisma';
import { LoginDto } from './input/login.dto';
import { hash } from 'bcrypt';
import { ProfileType, RegisterDto } from './input/register.dto';
import { AuthService } from './auth.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async createSession(@Body() dto: LoginDto) {
    const verifiedUser = await this.authService.verifyUser(
      dto.email,
      dto.password,
    );
    const token = randomStringGenerator();

    return prisma.session.create({
      data: {
        token,
        user: {
          connect: {
            id: verifiedUser.id,
          },
        },
      },
    });
  }

  @Post('register')
  async createUser(@Body() dto: RegisterDto) {
    const password = await hash(dto.password, 10);

    const user = await prisma.user
      .create({
        data: {
          password,
          email: dto.email,
          name: dto.name,
        },
      })
      .catch((e) => {
        if (e.code === 'P2002') {
          throw new ConflictException();
        }

        throw e;
      });

    if (dto.profileType === ProfileType.CANDIDATE) {
      await prisma.candidateProfile.create({
        data: {
          user: { connect: { id: user.id } },
          description: dto.candidateDescription,
          email: dto.candidateEmail,
          stack: dto.candidateTechStack,
          salary: dto.candidateSalary,
          position: dto.candidatePosition,
        },
      });
    }

    delete user.password;

    return user;
  }
}
