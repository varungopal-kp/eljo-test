import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import { Constants } from 'src/config/constants';

export const compressFiles = async (
  files: Express.Multer.File[],
  zipFilePath: string,
) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(true));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    // Append each file to the archive
    files.forEach((file) => {
      const filePath = path.join(process.cwd(), file.path);
      archive.append(fs.createReadStream(filePath), {
        name: file.originalname,
      });
    });

    archive.finalize();
  });
};

export const createZipArchive = async (
  files: Express.Multer.File[],
): Promise<string> => {
  const rootPath = path.join(process.cwd());
  const zipPath = 'uploads/' + `${Date.now()}.zip`;
  const zipFileFullPath = path.join(rootPath, Constants.PUBLIC_FOLDER, zipPath);

  await compressFiles(files, zipFileFullPath);
  return zipPath;
};
