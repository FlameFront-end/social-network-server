import {
	BadRequestException,
	Controller,
	Post,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import * as Bytescale from '@bytescale/sdk'
import nodeFetch from 'node-fetch'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	private readonly uploadManager = new Bytescale.UploadManager({
		fetchApi: nodeFetch as any,
		apiKey: process.env.BYTESCALE_API_KEY
	})

	@Post('image')
	@UseInterceptors(
		FilesInterceptor('image', 10, {
			// Позволяет загружать до 10 файлов
			limits: { fileSize: 5 * 1024 * 1024 },
			fileFilter: (_, file, cb) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					return cb(new BadRequestException('Unsupported file type'), false)
				}
				cb(null, true)
			}
		})
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				image: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			}
		}
	})
	async create(@UploadedFiles() images: Express.Multer.File[]) {
		if (!images || images.length === 0) {
			throw new BadRequestException('File upload failed')
		}

		const uploadedUrls = []
		try {
			for (const image of images) {
				const { fileUrl } = await this.uploadManager.upload({
					data: image.buffer,
					mime: image.mimetype,
					originalFileName: `${uuidv4()}_${image.originalname}`
				})
				uploadedUrls.push(fileUrl)
			}

			return { urls: uploadedUrls }
		} catch (error) {
			throw new BadRequestException(`File upload failed: ${error.message}`)
		}
	}
}
