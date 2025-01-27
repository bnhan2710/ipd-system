import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
