import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient } from 'src/entities/Patient';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
 import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DoctorAvailability } from 'src/entities/Doctor_availabilities';
import { DoctorTimeSlot } from 'src/entities/doctor_time_slots';
import { AuthModule } from 'src/auth/auth.module';
import { DoctorModule } from 'src/doctor/doctor.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, DoctorAvailability, DoctorTimeSlot]),
    ConfigModule,
    AuthModule,
    DoctorModule,
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
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
