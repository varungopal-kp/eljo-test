import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Req,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { MailService } from '../../helpers/mail.service';
import { TransferService } from './transfer.service';
import { ResponseHelper } from 'src/helpers/response.helper';
import { createZipArchive } from 'src/helpers/file.service';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly mailService: MailService,
    private readonly transferService: TransferService,
  ) {}

  @Post('share-files')
  @UseInterceptors(FilesInterceptor('files'))
  async shareFiles(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { title: string; message: string; emailTo: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userEmail = req['userEmail'];
    const { title, message, emailTo } = body;

    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const zipPath = await createZipArchive(files);
    const document = await this.saveTransferDetails({
      fromEmail: userEmail,
      toEmail: emailTo,
      filePath: zipPath,
      title,
      message,
      status: true,
    });

    const fileToken = await this.transferService.assignToken({
      fromEmail: userEmail,
      document: zipPath,
    });

    await this.sendEmailShare({
      fromEmail: userEmail,
      emailTo,
      title,
      message,
      fileToken,
      zipPath,
    });

    return ResponseHelper.success(res, document);
  }

  @Post('share-guest')
  @UseInterceptors(FilesInterceptor('files'))
  async shareGuestFiles(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: {
      title: string;
      message: string;
      emailTo: string;
      fromEmail: string;
    },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { title, message, emailTo, fromEmail } = body;

    if (!files || files.length === 0) {
      return ResponseHelper.error(res, 'No files uploaded', 400);
    }

    const otp = await this.createUserOtp(fromEmail);
    const zipPath = await createZipArchive(files);

    const document = await this.saveTransferDetails({
      fromEmail,
      toEmail: emailTo,
      filePath: zipPath,
      title,
      message,
      status: false,
    });

    const fileToken = await this.transferService.assignToken({
      fromEmail,
      documentId: document.id,
    });

    await this.sendEmailOtp({
      fromEmail,
      emailTo,
      otp,
      fileToken,
    });

    return ResponseHelper.success(res, fileToken);
  }

  @Post('send/guest/:id')
  async getTransfer(@Req() req: Request, @Res() res: Response) {
    const { id } = req['params'];
    const user = await this.transferService.getUserById(req['userId']);

    const transfer = await this.transferService.getTransfer(id);
    if (transfer.fromEmail !== user.email) {
      return ResponseHelper.error(res, 'File is not accessible', 400);
    }

    const fileToken = await this.transferService.assignToken({
      fromEmail: transfer.fromEmail,
      document: transfer.filePath,
    });

    await this.sendEmailShare({
      fromEmail: transfer.fromEmail,
      emailTo: transfer.toEmail,
      title: transfer.title,
      message: transfer.message,
      fileToken,
      zipPath: transfer.filePath,
    });

    transfer.status = true;
    transfer.save();

    return ResponseHelper.success(res, transfer);
  }

  private async createUserOtp(email: string): Promise<number> {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const user = await this.transferService.getUserByEmail(email);
    if (!user) {
      await this.transferService.createUser({ email, otp, loginType: 'guest' });
    } else {
      await this.transferService.updateUser(user.id, { otp });
    }
    return otp;
  }

  private async saveTransferDetails(transferData: {
    fromEmail: string;
    toEmail: string;
    filePath: string;
    title: string;
    message: string;
    status: boolean;
  }) {
    return this.transferService.saveTransfer(transferData);
  }

  private async sendEmailShare(emailData: {
    fromEmail: string;
    emailTo: string;
    title: string;
    message: string;
    fileToken: string;
    zipPath: string;
  }) {
    const { fromEmail, emailTo, title, message, fileToken, zipPath } =
      emailData;
    const zipFileFullPath = path.join(process.cwd(), 'public', zipPath);

    await this.mailService.sendEmail({
      from: fromEmail,
      to: emailTo,
      subject: title,
      text: message,
      attachments: [{ filename: 'uploaded-files.zip', path: zipFileFullPath }],
      data: { fileToken },
    });
  }

  private async sendEmailOtp(emailData: {
    fromEmail: string;
    emailTo: string;
    otp: number;
    fileToken: string;
  }) {
    const { fromEmail, emailTo, otp, fileToken } = emailData;

    await this.mailService.sendEmail({
      from: fromEmail,
      to: fromEmail,
      subject: 'OTP',
      mailType: 2,
      data: { otp, fileToken },
    });
  }
}
