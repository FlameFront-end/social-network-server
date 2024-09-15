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
import { avaStorage } from '../storage'
import * as uuid from 'uuid'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	@Post('image')
	@UseInterceptors(
		FileInterceptor('ava', {
			storage: avaStorage,
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
				ava: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async create(@UploadedFile() ava: Express.Multer.File, @Req() req: Request) {
		if (!ava) {
			throw new BadRequestException('File upload failed')
		}

		const fileExtension = ava.filename.split('.').pop()
		const fileName = `${uuid.v4()}.${fileExtension}`

		const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`
		return { url: fileUrl }
	}
}
