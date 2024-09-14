import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { FilesModule } from '../files/files.module'

@Module({
	controllers: [UploadController],
	imports: [FilesModule]
})
export class UploadModule {}
