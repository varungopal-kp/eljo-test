import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Constants } from 'src/config/constants';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: Constants.SMTP.SERVICE, // Use your email service here
      auth: {
        user: Constants.SMTP.USER, // Replace with your email
        pass: Constants.SMTP.PASSWORD, // Replace with your email password or use an app password
      },
    });
  }

  async sendEmail({
    from,
    to,
    subject,
    text = '',
    attachments = [],
    mailType = 1,
    data = {} as any,
  }) {
    const mailOptions: any = {
      from,
      to,
      subject: subject,
    };

    if (mailType === 1) {
      const htmlTemplate = this.shareTemplate1(to, from, text, data.fileToken);

      mailOptions.html = htmlTemplate;
      mailOptions.attachments = attachments;
    } else if (mailType === 2) {
      const htmlTemplate = this.shareTemplate2(data.otp);
      mailOptions.html = htmlTemplate;
    }

    console.log('Sending email...', mailOptions);

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  shareTemplate1(to: string, from: string, text: string, fileToken: string) {
    const logo = Constants.LOGO_URL;
    const redirectUrl = `${Constants.APP_BASE_URL}?fileToken=${fileToken}`;
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .logo {
          width: 100px;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #333333;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <img src="${logo}" alt="Logo" class="logo" />
        <p class="message">Hello, ${from} has shared a file with you.</p>
        <p>${text}</p>
        <p class="message">Click the button below to download your file.</p>
        <a href="${redirectUrl}" class="button" _target="blank">Download</a>
      </div>
    </body>
    </html>
    `;

    return htmlTemplate;
  }
  shareTemplate2(otp: string) {
    const logo = Constants.LOGO_URL;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .logo {
          width: 100px;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #333333;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <img src="${logo}" alt="Logo" class="logo" />
        <p class="message">Hello, your OTP is:</p>
        <p>${otp}</p>
        
      </div>
    </body>
    </html>
    `;

    return htmlTemplate;
  }
}
