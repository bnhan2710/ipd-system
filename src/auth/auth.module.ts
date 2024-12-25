import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentKeyFactory } from '@shared/services';
import { UserModule } from '../user/user.module';
@Module({

  imports: [
    JwtModule.register({}),
    UserModule
  ],
  providers: [ 
    AuthService, 
    LocalStategy,
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
