import { Controller, Post, Body, Get,Delete,Header, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string; role: 'doctor' | 'patient'; specialization?: string }) {
    return this.authService.signup(body);
  }

@Post('signin')
signin(@Body() body: { email: string; password: string }) {
  return this.authService.signin(body);
}

  @Post('signout')
  signout(@Body('email') email: string) {
    return this.authService.signout(email);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }


  @Get('google')
  async googleAuth(@Req() req, @Res() res, @Query('role') role: 'doctor' | 'patient') {
    console.log('Google auth initiated with role:', role);
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${this.configService.get<string>('GOOGLE_CLIENT_ID')}` +
      `&redirect_uri=${encodeURIComponent(this.configService.get<string>('GOOGLE_CALLBACK_URL') || '')}` +
      `&response_type=code&scope=email profile&state=${role}`;
      console.log(role);
    return res.redirect(redirectUrl);
  }

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req, @Res() res) {
  try {
    const user = req.user;
    console.log('Google callback user:', user);
    const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d' },
    );
    user.refreshToken = refreshToken;
    return res.json({ accessToken, refreshToken, role: user.role });
  } catch (err) {
    console.error('Google callback error:', err);
    return res.status(400).json({ message: 'Google authentication failed', error: err.message });
  }
}}