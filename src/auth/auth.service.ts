import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwToken({ id: user.id }),
    };
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwToken({ id: user.id }),
      };
    } catch (error) {
      return this.handleDBErrors(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }, // CON ESTA QUERY MANUAL, ELIJO LAS PROPS Q QUIERO MOSTRAR
    });

    if (!user) {
      throw new UnauthorizedException(`Credentials are not valid (email)`);
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    return { ...user, token: this.getJwToken({ id: user.id }) };
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(`Please check server logs`);
  }
}
