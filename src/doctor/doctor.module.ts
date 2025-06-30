import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { User } from '../entities/User';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorAvailability } from 'src/entities/Doctor_availabilities';
import { DoctorTimeSlot } from 'src/entities/doctor_time_slots';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [    TypeOrmModule.forFeature([Doctor,DoctorAvailability,DoctorTimeSlot]),
      ConfigModule, 
      AuthModule,
      JwtModule.registerAsync({
        imports: [ConfigModule], // import config
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') || '1h',
          },
        }),
      }),],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],

})
export class DoctorModule {}
