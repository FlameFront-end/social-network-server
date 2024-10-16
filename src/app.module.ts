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
import { FriendsModule } from './friends/friends.module'
import { MailModule } from './mail/mail.module'
import { UserDetailsEntity } from './user/entities/user-details.entity'
import { OnlineStatusGateway } from './online-status/online-status.gateway'
import { OnlineStatusModule } from './online-status/online-status.module'
import { JwtModule } from '@nestjs/jwt'
import { PostModule } from './post/post.module'
import { CommentEntity } from './post/entities/comment.entity'
import { PostEntity } from './post/entities/post.entity'

@Module({
	imports: [
		UserModule,
		AuthModule,
		ChatModule,
		UploadModule,
		MailModule,
		FriendsModule,
		OnlineStatusModule,
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
			entities: [
				MessageEntity,
				ChatEntity,
				UserEntity,
				UserDetailsEntity,
				CommentEntity,
				PostEntity
			],
			synchronize: true
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService]
		}),
		TypeOrmModule.forFeature([
			MessageEntity,
			ChatEntity,
			UserEntity,
			UserDetailsEntity,
			CommentEntity,
			PostEntity
		]),
		PostModule
	],
	controllers: [],
	providers: [ChatGateway, ChatService, OnlineStatusGateway]
})
export class AppModule {}
