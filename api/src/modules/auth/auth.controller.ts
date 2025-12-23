import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RequestWithUser } from './types/auth.types';
import { SessionGuard } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req: RequestWithUser, @Res() res: Response) {
    req.login(req.user, () => {
      return res.status(200).json(req.user);
    });
  }

  @Post('logout')
  logout(@Request() req: RequestWithUser, @Res() res: Response) {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.sendStatus(200);
      });
    });
  }

  @Get('check')
  @UseGuards(SessionGuard)
  checkAuth(@Request() req: RequestWithUser) {
    return req.user;
  }
}
