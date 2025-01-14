import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class TokenService {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService(jwtConfig);
  }

  
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  assignToken(data, expiresIn = '23h') {
    return this.jwtService.sign(data, { expiresIn: expiresIn });
  }
}
