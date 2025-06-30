import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { ConfigService } from '@nestjs/config';
import { Doctor } from 'src/entities/Doctor';
import { Patient } from 'src/entities/Patient';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    private configService: ConfigService,
  ) {
        super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

async validate(
  req: any,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback,
) {
  const email = profile.emails[0].value;
  const name = profile.displayName;
  // Use state as role
  const role = req.query.state ;

  let user = await this.userRepo.findOne({ where: { email } });

  if (user) {
    if (user.provider !== 'google') {
      return done(
        new UnauthorizedException('Account is registered via Email/Password. Please login with password.'),
        false,
      );
    }
    // Optionally update role if needed
    if (user.role !== role) {
      user.role = role;
      console.log(user.role,role)
      await this.userRepo.save(user);
    }
     if (user.role === 'patient') {
  const patientExists = await this.patientRepo.findOne({ where: { email: user.email } });
  console.log('Patient profile exists:', patientExists);
  if (!patientExists) {
    console.log("s")
    await this.patientRepo.save({
      email: user.email,
      first_name: user.name.split(' ')[0],
      last_name: user.name.split(' ').slice(1).join(' '),
      phone_number: '', // add phone number if available
      address: '', // add address if available
      medical_history: '' ,// add medical history if available
      gender: '',
      dob: new Date(), // add date of birth if available
emergency_contact: '', // add emergency contact if available

    });
  }
}

  } 
  else {
    console.log(role)
    user = this.userRepo.create({
      email,
      name,
      provider: 'google',
      password: undefined,
      role,
    });
    await this.userRepo.save(user);
 if (user.role === 'doctor') {
  console.log('Creating doctor profile for:', user.email);
  const doctorExists = await this.doctorRepo.findOne({ where: { email: user.email } });
  if (!doctorExists) {
    console.log('Doctor profile does not exist, creating new one');
    await this.doctorRepo.save({
      first_name: user.name.split(' ')[0],
      last_name: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      specialization: '', 
      phone_number: '', 
        experience_years: 0,
      education: '',
      clinic_name: '',
      clinic_address: '',
      available_days: '',
      available_time_slots: '',
      password: '',

    });
  }
}

  }

  done(null, user);
}}