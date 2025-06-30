import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

export function RoleGuard(role: 'doctor' | 'patient') {
  return (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (req.user.role !== role) throw new ForbiddenException('Forbidden');
    return true;
  };
}