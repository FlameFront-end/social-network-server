import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UserEntity } from './user/entities/user.entity'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
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
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRESS_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRESS_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [MessageEntity, ChatEntity, UserEntity],
			synchronize: true
		}),
		TypeOrmModule.forFeature([MessageEntity, ChatEntity, UserEntity])
	],
	controllers: [],
	providers: [ChatGateway, ChatService]
})
export class AppModule {}
