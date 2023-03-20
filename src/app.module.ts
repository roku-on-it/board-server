import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [UserModule, SessionModule, AuthModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
