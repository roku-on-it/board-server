import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { prisma } from '../db/prisma';
import { CreateMessageDto } from './input/create-message.dto';
import { CurrentUser } from '../../decorators/current-user';
import { CreateRoomDto } from './input/create-room.dto';
import { User } from '../user/model/user';

@Controller('message')
export class MessageController {
  @Post('create-room')
  async createRoom(@CurrentUser() user, @Body() dto: CreateRoomDto) {
    const recipientUser = await User.findOne({ where: { id: dto.userId } });

    return prisma.room.create({
      data: {
        recipients: user.id + ',' + recipientUser.id,
      },
    });
  }

  @Post('send-message')
  async sendMessage(@CurrentUser() user, @Body() dto: CreateMessageDto) {
    console.log(user.id + ',' + dto.recipient);
    const room = await prisma.room.findFirst({
      where: {
        OR: [
          {
            recipients: user.id + ',' + dto.recipient,
          },
          {
            recipients: dto.recipient + ',' + user.id,
          },
        ],
      },
    });

    return prisma.message.create({
      data: {
        fromId: <number>user.id,
        content: dto.content,
        fromName: user.name,
        roomId: room.id,
      },
    });
  }

  @Get('get-chat/:recipientId')
  async getChat(
    @CurrentUser() user,
    @Param('recipientId', new ParseIntPipe()) recipientId: number,
  ) {
    return prisma.room.findFirstOrThrow({
      where: {
        OR: [
          {
            recipients: user.id + ',' + recipientId,
          },
          {
            recipients: recipientId + ',' + user.id,
          },
        ],
      },
      include: {
        messages: true,
      },
    });
  }
}
