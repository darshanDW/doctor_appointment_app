import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/Appointment';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Doctor } from 'src/entities/Doctor';
import { DoctorTimeSlot } from 'src/entities/doctor_time_slots';
import { Patient } from 'src/entities/Patient';

@Module({
   imports: [    TypeOrmModule.forFeature([Appointment,Doctor,DoctorTimeSlot,Patient]),
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
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
