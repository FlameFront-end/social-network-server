import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { avaStorage } from '../storage';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('ava', {
      storage: avaStorage,
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(new BadRequestException('Unsupported file type'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ava: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(@UploadedFile() ava: Express.Multer.File) {
    if (!ava) {
      throw new BadRequestException('File upload failed');
    }
    return { url: `http://localhost:3000/uploads/ava/${ava.filename}` };
  }
}
