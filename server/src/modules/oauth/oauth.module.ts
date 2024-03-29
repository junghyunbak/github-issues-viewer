import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

@Module({
  imports: [],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule {}
