import { Controller, Get,Param,Query,Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnorderedBulkOperation } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { PatientService } from './patient.service';
import { DoctorService } from 'src/doctor/doctor.service';
@Controller('api/v1/patient')
export class PatientController {
  constructor(private jwtService: JwtService, private DoctorService: DoctorService, private patientService: PatientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    if (req.user.role !== 'patient') throw new ForbiddenException('Forbidden');
    // You can fetch more patient info from DB if needed using req.user.id
    return { profile: req.user };
  }

  
@Get('doctors/:id/availability')
@UseGuards(JwtAuthGuard)
async getDoctorAvailability(
  @Param('id') doctorId: string,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Req() req
) {
  if (req.user.role !== 'patient') {
    throw new UnauthorizedException('Only patients can view availability');
  }
  return this.patientService.getDoctorAvailability(Number(doctorId), Number(page), Number(limit));
}}