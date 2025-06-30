import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Doctor } from '../entities/Doctor';
import { Patient } from 'src/entities/Patient';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/entities/User';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PatientController } from 'src/patient/patient.controller';
import { GoogleStrategy } from './google.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor,Patient,User]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // import config
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy, JwtAuthGuard],
})
export class AuthModule {}
