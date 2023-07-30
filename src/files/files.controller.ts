import {
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesServiceAbstract } from './files-service-abstract/files-service-abstract';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesServiceAbstract) {}

  @Get()
  getUsers() {
    return this.filesService.getListOfFiles();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.filesService.uploadFile({
      fileName: file.originalname,
      file: file.buffer,
    });
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    await this.filesService.deleteFile(fileName);
  }

  @Get(':fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return new StreamableFile(await this.filesService.downloadFile(fileName));
  }
}
