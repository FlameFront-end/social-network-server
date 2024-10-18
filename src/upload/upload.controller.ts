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

	@Post()
	@UseInterceptors(
		FilesInterceptor('file', 10, {
			limits: { fileSize: 5 * 1024 * 1024 }
		})
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			}
		}
	})
	async upload(@UploadedFiles() files: Express.Multer.File[]) {
		if (!files || files.length === 0) {
			throw new BadRequestException('File upload failed')
		}

		const uploadedUrls = []
		try {
			for (const file of files) {
				const { fileUrl } = await this.uploadManager.upload({
					data: file.buffer,
					mime: file.mimetype,
					originalFileName: `${uuidv4()}_${file.originalname}`
				})
				uploadedUrls.push(fileUrl)
			}

			return { urls: uploadedUrls }
		} catch (error) {
			throw new BadRequestException(`File upload failed: ${error.message}`)
		}
	}
}
