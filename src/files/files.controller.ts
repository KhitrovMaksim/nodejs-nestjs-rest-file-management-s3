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
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    const downloadedFile: GetObjectCommandOutput =
      await this.filesService.downloadFile(fileName);

    return new StreamableFile(await downloadedFile.Body.transformToByteArray());
  }
}
