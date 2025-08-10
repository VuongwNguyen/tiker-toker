import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TokenService } from './auth/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';

@Module({
  controllers: [AppController],
  providers: [AppService, TokenService],
  imports: [
    AuthModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
    }),
    MailModule,
  ],
  exports: [TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // You can add global middleware or other configurations here if needed
  }
}
