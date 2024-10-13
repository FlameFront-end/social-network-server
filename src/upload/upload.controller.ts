import {
	BadRequestException,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import * as axios from 'axios'
import * as process from 'node:process'
import { v4 as uuidv4 } from 'uuid' // Import UUID

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	private readonly YANDEX_API_BASE_URL =
		'https://cloud-api.yandex.net/v1/disk/resources'
	private readonly OAUTH_TOKEN = process.env.OAUTH_TOKEN

	private getAuthHeaders() {
		return {
			Authorization: `OAuth ${this.OAUTH_TOKEN}`
		}
	}

	private async getYandexDiskUrl(endpoint: string, path: string) {
		const response = await axios.default.get(
			`${this.YANDEX_API_BASE_URL}/${endpoint}?path=${encodeURIComponent(path)}`,
			{ headers: this.getAuthHeaders() }
		)
		return response.data.href
	}

	@Post('image')
	@UseInterceptors(
		FileInterceptor('image', {
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
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async create(@UploadedFile() image: Express.Multer.File) {
		if (!image) {
			throw new BadRequestException('File upload failed')
		}

		const filePath = `${uuidv4()}_${image.originalname}`

		const uploadUrl = await this.getYandexDiskUrl('upload', filePath)

		await axios.default.put(uploadUrl, image.buffer, {
			headers: { 'Content-Type': 'application/octet-stream' }
		})

		await axios.default.put(
			`${this.YANDEX_API_BASE_URL}/publish?path=${encodeURIComponent(filePath)}`,
			null,
			{ headers: this.getAuthHeaders() }
		)

		const fileUrl = await this.getYandexDiskUrl('download', filePath)

		return { url: fileUrl }
	}
}
