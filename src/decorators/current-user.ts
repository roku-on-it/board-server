import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../modules/db/prisma';

export const CurrentUser = createParamDecorator(async (data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const authToken = request.headers.authorization;

  if (!authToken) {
    throw new UnauthorizedException('No auth token provided');
  }

  console.log(authToken);

  const session = await prisma.session.findUnique({
    include: {
      user: true,
    },

    where: {
      token: authToken,
    },
  });

  return session.user;
});
