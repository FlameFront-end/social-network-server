import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { OnlineStatusGateway } from './online-status.gateway'

@Module({
	providers: [JwtStrategy, OnlineStatusGateway],
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService]
		})
	]
})
export class OnlineStatusModule {}
