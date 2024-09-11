import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UserEntity } from './user/entities/user.entity'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ChatModule } from './chat/chat.module'
import { ChatService } from './chat/chat.service'
import { UploadModule } from './upload/upload.module'
import { ChatGateway } from './chat/chat.gateway'
import { ChatEntity } from './chat/entities/chat.entity'
import { MessageEntity } from './chat/entities/message.entity'

@Module({
	imports: [
		UserModule,
		AuthModule,
		ChatModule,
		UploadModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DATABASE_HOST'),
				username: configService.get('DATABASE_USERNAME'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				entities: [MessageEntity, ChatEntity, UserEntity],
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		TypeOrmModule.forFeature([MessageEntity, ChatEntity, UserEntity])
	],
	controllers: [],
	providers: [ChatGateway, ChatService]
})
export class AppModule {}
