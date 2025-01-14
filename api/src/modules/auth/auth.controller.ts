import { ResponseHelper } from '../../helpers/response.helper';

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../../dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Res() res: Response, @Body() signupDto: SignupDto) {
    const user = await this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
    );
    return ResponseHelper.success(res, user, 'User created successfully');
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const tokens = await this.authService.signin(email, password);
    return ResponseHelper.success(res, tokens, 'User logged in successfully');
  }

  @Post('refresh-token')
  async refreshToken(
    @Res() res: Response,
    @Body('refreshToken') refreshToken: string,
  ) {
    const tokens = await this.authService.refreshToken(refreshToken);
    return ResponseHelper.success(res, tokens, 'Token refreshed successfully');
  }

  @Post('verify-googleToken')
  async verifyGoogleToken(
    @Res() res: Response,
    @Body('credential') credential: string,
    @Body('clientId') clientId: string,
  ) {
    const client = new OAuth2Client(clientId);
    // Call the verifyIdToken to
    // varify and decode it
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    // Get the JSON with all the user info
    const payload = ticket.getPayload();

    const createUserToken = await this.authService.createSocialUser(
      payload.name,
      payload.email,
    );

    return ResponseHelper.success(
      res,
      createUserToken,
      'Google token verified successfully',
    );
  }

  @Post('verify-token')
  async verifyFileToken(@Res() res: Response, @Body('token') token: string) {
    const tokenDetails = await this.authService.verifyToken(token);
    return ResponseHelper.success(
      res,
      tokenDetails,
      'Token verified successfully',
    );
  }

  @Post('otp-verify')
  async otpVerify(
    @Res() res: Response,
    @Body()
    body: {
      otp: string;
      transferToken: string;
    },
  ) {
    try {
      const { otp, transferToken } = body;

      const tokenDetails: any =
        await this.authService.verifyToken(transferToken);
      const verifyOtp = await this.authService.otpVerify(
        otp,
        tokenDetails.fromEmail,
      );

      if (!verifyOtp) {
        return ResponseHelper.error(
          res,
          'Token failed error',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.authService.getUserByEmail(
        tokenDetails.fromEmail,
      );

      const token = await this.authService.generateTokens(user);

      return ResponseHelper.success(
        res,
        { token, data: { document: tokenDetails.documentId } },
        'OTP verified successfully',
      );
    } catch (error) {
      console.error(error);
    }
  }
}
