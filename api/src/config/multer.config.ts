import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Constants } from './constants';

export const multerConfig = MulterModule.register({
  storage: diskStorage({
    destination: Constants.MULTER_DESTINATION,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname); // Extract the original file extension
      const filename = `${uniqueSuffix}${ext}`; // Add the extension to the filename
      callback(null, filename);
    },
  }),
});
