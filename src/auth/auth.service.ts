import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Dto/CreateUser.dto';
import { User } from './Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './Dto/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './jwtPayload';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  GeneratedToken(payload: jwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //register
  async Register(createUserDto: CreateUserDto) {
    const { email, password, ...UserData } = createUserDto;

    const user = this.userRepository.create({
      ...UserData,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const SearchEmail = await this.userRepository.findOneBy({ email });
    if (SearchEmail) {
      throw new BadRequestException(
        `el usuario con el email ${email} ya existe`,
      );
    }
    return {
      ...this.userRepository.save(user),
      access_token: this.GeneratedToken({
        id: user.id,
        email: user.email,
        roles: user.roles
      }),
    };
  }
  //login
  async Login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const emailExiste = await this.userRepository.findOneBy({ email });
    if (!emailExiste) {
      throw new BadRequestException(`el email ${email} no existe`);
    }
    const comparepassword = bcrypt.compareSync(password, emailExiste.password);
    if (!comparepassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    delete emailExiste.password;
    return {
      access_token: this.GeneratedToken({
        id: emailExiste.id,
        email: emailExiste.email,
        roles: emailExiste.roles
      }),
      emailExiste,
    };
  }
}
