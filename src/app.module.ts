import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";

import { AuthModule } from "./app/auth/auth.module";
import { ProfileModule } from "./app/profile/profile.module";
import { MessageModule } from './app/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DATABASE),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),

    AuthModule,
    ProfileModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
