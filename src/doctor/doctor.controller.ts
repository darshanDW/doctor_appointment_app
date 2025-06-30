import { Controller, Get,Post,Body,Patch, Req,Query, Param,UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { DoctorService } from './doctor.service';

@Controller('api/v1/doctor')
export class DoctorController {
  constructor(private jwtService: JwtService,private doctorService: DoctorService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    if (req.user.role !== 'doctor') throw new ForbiddenException('Forbidden');
    // You can fetch more doctor info from DB if needed using req.user.id
    return { profile: req.user };
  }

    @Get('/')
  async listDoctors(
    @Query('first_name') first_name?: string,
    @Query('specialization') specialization?: string,
  ) {
    return this.doctorService.listDoctors(first_name, specialization);
  }

  // Get details of a specific doctor by ID
  @Get('/:id')
  async getDoctor(@Param('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }

  @Post('/:id/availability')
@UseGuards(JwtAuthGuard) 
async setAvailability(
  @Param('id') doctorId: string,
  @Body() body: { date: string; start_time: string; end_time: string; weekdays: string[]; session: string },
  @Req() req
) {
  // Only allow doctor to set their own availability
  if (req.user.role !== 'doctor' || req.user.id !== Number(doctorId)) {
    throw new UnauthorizedException('You can only set your own availability');
  }
  return this.doctorService.setDoctorAvailability(Number(doctorId), body);
}
@Patch('/:id/schedule_Type')
@UseGuards(JwtAuthGuard)
async updateScheduleType(
  @Param('id') doctorId: string,
  @Body('schedule_Type') schedule_Type: 'stream' | 'wave',
  @Req() req
) {
  if (req.user.role !== 'doctor' || req.user.id !== Number(doctorId)) {
    throw new UnauthorizedException('You can only update your own schedule type');
  }
  return this.doctorService.updateScheduleType(Number(doctorId), schedule_Type);
}

}