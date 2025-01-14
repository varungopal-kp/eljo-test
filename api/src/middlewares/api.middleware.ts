import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const secret = jwtConfig.secret;

      // Decode the token
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      req['userId'] = decoded['userId'];
      req['userEmail'] = decoded['userEmail'];

      next();
    } catch (error) {
      console.error('Error decoding token:', error.message);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
