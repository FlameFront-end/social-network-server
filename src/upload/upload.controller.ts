import {
	BadRequestException,
	Controller,
	Post,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { imagesStorage } from '../storage'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	@Post('image')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: imagesStorage,
			fileFilter: (_, file, cb) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
					cb(new BadRequestException('Unsupported file type'), false)
				}
				cb(null, true)
			},
			limits: {
				fileSize: 5 * 1024 * 1024
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
	async create(
		@UploadedFile() image: Express.Multer.File,
		@Req() req: Request
	) {
		if (!image) {
			throw new BadRequestException('File upload failed')
		}

		const fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${image.filename}`
		return { url: fileUrl }
	}
}
