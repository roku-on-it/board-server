import { prisma } from '../../modules/db/prisma';
import { NotFoundException } from '@nestjs/common';

export function BaseEntity(entity: string) {
  return class {
    static findOne(options: any) {
      return prisma[entity].findFirstOrThrow(options).catch((e) => {
        if (e.code === 'P2025') {
          throw new NotFoundException();
        }

        throw e;
      });
    }
  };
}
