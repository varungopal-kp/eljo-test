export const Constants = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '2h',

  SMTP: {
    SERVICE: process.env.SMTP_SERVICE || 'gmail',
    USER: process.env.SMTP_USER || '',
    PASSWORD: process.env.SMTP_PASSWORD || '',
  },

  LOGO_URL: process.env.LOGO_URL || 'http://localhost:8000/files/logo.png',
  PUBLIC_FOLDER: process.env.PUBLIC_FOLDER || 'public',
  MULTER_DESTINATION: process.env.MULTER_DESTINATION || './public/uploads',
  PROIVDERS: {
    USER_REPOSITORY: 'USER_REPOSITORY',
    TRANSFER_REPOSITORY: 'TRANSFER_REPOSITORY',
  },
};
