import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FilesServiceAbstract } from './files-service-abstract/files-service-abstract';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class FilesService extends FilesServiceAbstract {
  private readonly client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async getListOfFiles(): Promise<ListObjectsCommandOutput> {
    return await this.client.send(
      new ListObjectsCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      }),
    );
  }

  async uploadFile(dto: UploadFileDto) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: dto.fileName,
        Body: dto.file,
      }),
    );
  }

  async deleteFile(fileName: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: fileName,
      }),
    );
  }

  async downloadFile(fileName: string): Promise<Uint8Array> {
    const downloadedFile: GetObjectCommandOutput = await this.client.send(
      new GetObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: fileName,
      }),
    );
    return await downloadedFile.Body.transformToByteArray();
  }
}
