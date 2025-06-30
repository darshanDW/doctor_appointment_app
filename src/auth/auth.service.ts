import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { Doctor } from 'src/entities/Doctor';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    private jwtService: JwtService,
  ) {}

  async signup(data: { name: string; email: string; password: string; role: 'doctor' | 'patient'; specialization?: string }) {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) throw new UnauthorizedException('Email already exists');
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({ ...data, password: hashed });
    await this.userRepo.save(user);
    return { message: 'Signup successful', role: user.role };
  }

  async signin(data: { email: string; password: string | undefined }) {
    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password || '', user.password || '')))
      throw new UnauthorizedException('Invalid credentials');
    if (user.provider === 'google')
    throw new UnauthorizedException('Account is registered via Google. Please login with Google.');
    const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
    );

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);
    return { accessToken, refreshToken, role: user.role };
  }

  async signout(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      user.refreshToken = undefined;
      await this.userRepo.save(user);
    }
    return { message: 'Signed out' };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userRepo.findOne({ where: { id: payload.id } });
      if (!user || user.refreshToken !== refreshToken)
        throw new UnauthorizedException('Invalid refresh token');
      const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
      const newRefreshToken = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
      );
      user.refreshToken = newRefreshToken;
      await this.userRepo.save(user);
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async listDoctors(name?: string, specialization?: string) {
    const where: any = { };
    if (name) {
      where.name = ILike(`%${name}%`);
    }
    if (specialization) {
      where.specialization = ILike(`%${specialization}%`);
    }
    return this.doctorRepo.find({ where });
  }

  async getDoctorById(id: string) {
    return this.doctorRepo.findOne({ where: { doctor_id: Number(id) } });
  }
}
