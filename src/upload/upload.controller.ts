import {
	BadRequestException,
	Controller,
	Post,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FilesService } from '../files/files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
	constructor(private readonly fileService: FilesService) {}

	@Post('image')
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
	@UseInterceptors(FileInterceptor('ava'))
	async create(@UploadedFile() ava: Express.Multer.File, @Req() req: Request) {
		if (!ava) {
			throw new BadRequestException('File upload failed')
		}
		const fileName = await this.fileService.createFile(ava)
		const fileUrl = `${req.protocol}://${req.get('host')}/${fileName}`
		return { url: fileUrl }
	}
}
