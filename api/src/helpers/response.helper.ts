import { HttpStatus } from '@nestjs/common';

export class ResponseHelper {
  constructor() {}
  static success(
    res,
    data: any = {},
    message = 'Success',
    statusCode = HttpStatus.OK,
  ) {
    return res.status(statusCode).json({
      statusCode,
      message,
      data,
    });
  }

  static error(
    res,
    message = 'Something went wrong',
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    error: any = {},
  ) {
    return res.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
  private static statusMap = new Map<number, string>(
    Object.entries(HttpStatus).map(([key, value]) => [value as number, key]),
  );

  static getStatusText(statusCode: number): string {
    return this.statusMap.get(statusCode) || 'Unknown Status';
  }
}
