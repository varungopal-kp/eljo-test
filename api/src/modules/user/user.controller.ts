import { Controller, Get, Param, Put, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseHelper } from 'src/helpers/response.helper';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  async getUser(@Res() res: Response) {
    const users = await this.userService.getUsers();
    return ResponseHelper.success(res, users);
  }

  @Get('/profile')
  async getUserDetails(@Req() req: Request, @Res() res: Response) {   
    const userId = req['userId'];
    const user = await this.userService.getUserById(userId);
    return ResponseHelper.success(res, user);
  }

  @Put('profile')
  async updateUser(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];

    const user = await this.userService.updateUser(userId, req.body);
    return ResponseHelper.success(res, user);
  }
}
