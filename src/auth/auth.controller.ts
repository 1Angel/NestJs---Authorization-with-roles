import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './Dto/CreateUser.dto';
import { LoginUserDto } from './Dto/LoginUserDto';
import { Role } from './Entities/Role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './RoleGuard';
import { HasRoles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  Register(@Body() createUserDto: CreateUserDto) {
    return this.authService.Register(createUserDto);
  }

  @Post('login')
  Login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.Login(loginUserDto);
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  Private(){
    return "hola que tal"
  }


  @Get('rolesxd')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.Admin)
  RoleActive(@Request() req){
    console.log(req.user);
    return "puedes ver esto debido a que tienes rol de admin ua"
    ;
  }
}
