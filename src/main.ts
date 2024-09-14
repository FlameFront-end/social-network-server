import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const PORT = process.env.PORT || 5000
	const app = await NestFactory.create(AppModule)

	console.log('PORT', PORT)

	app.enableCors({ credentials: true, origin: true })

	const config = new DocumentBuilder()
		.setTitle('Social network')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/docs', app, document)

	await app.listen(PORT, () =>
		console.log(`Server started on port = http://localhost:${PORT}/api/docs`)
	)
}
bootstrap()
