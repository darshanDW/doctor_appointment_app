import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { AuthModule } from './auth/auth.module';
import { Doctor } from './entities/Doctor';
import { Patient } from './entities/Patient';
import { Appointment } from './entities/Appointment';
import { TimeSlot } from './entities/TimeSlot';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/User';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DoctorAvailability } from './entities/Doctor_availabilities';
import { DoctorTimeSlot } from './entities/doctor_time_slots';
import { AppointmentModule } from './appointment/appointment.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME') || 'rating_8kmo',
        ssl: {
          rejectUnauthorized: false, // Adjust based on your SSL requirements
        },
        entities: [Doctor,Patient,Appointment,TimeSlot,User,DoctorAvailability,DoctorTimeSlot],
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        logging: false,
      }),
    }),
    HelloWorldModule,
    AuthModule,
    JwtModule,
    DoctorModule,
    PatientModule,
    AppointmentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
