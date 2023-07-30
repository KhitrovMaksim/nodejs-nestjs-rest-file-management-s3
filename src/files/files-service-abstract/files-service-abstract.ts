import { UploadFileDto } from '../dto/upload-file.dto';

export abstract class FilesServiceAbstract {
  abstract getListOfFiles(): Promise<Object>;
  abstract uploadFile(dto: UploadFileDto): void;
  abstract deleteFile(fileName: string): void;
  abstract downloadFile(fileName: string): Promise<Uint8Array>;
}
