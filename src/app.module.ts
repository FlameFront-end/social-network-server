import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UserEntity } from './user/entities/user.entity'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MessageEntity } from './chat/message.entity'
import { ChatModule } from './chat/chat.module'
import { ChatService } from './chat/chat.service'
import { UploadModule } from './upload/upload.module';


@Module({
	imports: [
		UserModule,
		AuthModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DATABASE_HOST'),
				username: configService.get('DATABASE_USERNAME'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				entities: [UserEntity, MessageEntity],
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		ChatModule,
		UploadModule
	],
	controllers: [],
})
export class AppModule {}
