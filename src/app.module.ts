import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './auth/auth.module'
import { UserEntity } from './user/entities/user.entity'
import { UserModule } from './user/user.module'
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
import { PostsModule } from './posts/posts.module'
import { CommentsEntity } from './posts/entities/comments.entity'
import { PostsEntity } from './posts/entities/posts.entity'
import { TeachersModule } from './teachers/teachers.module'
import { TeacherEntity } from './teachers/entities/teacher.entity'
import { StudentsModule } from './students/students.module'
import { StudentEntity } from './students/entities/student.entity'
import { GroupsModule } from './groups/groups.module'
import { GroupEntity } from './groups/entities/group.entity'
import { ScheduleEntity } from './groups/entities/schedule.entity'

@Module({
	imports: [
		UserModule,
		AuthModule,
		ChatModule,
		UploadModule,
		MailModule,
		FriendsModule,
		OnlineStatusModule,
		PostsModule,
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
				CommentsEntity,
				PostsEntity,
				TeacherEntity,
				StudentEntity,
				GroupEntity,
				ScheduleEntity
			],
			synchronize: true,
			ssl:
				process.env.NODE_ENV === 'development'
					? false
					: { rejectUnauthorized: true }
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
			CommentsEntity,
			PostsEntity,
			TeacherEntity,
			StudentEntity,
			GroupEntity,
			ScheduleEntity
		]),
		TeachersModule,
		StudentsModule,
		GroupsModule
	],
	controllers: [],
	providers: [ChatGateway, ChatService, OnlineStatusGateway]
})
export class AppModule {}
