import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: any) {
    const payload = { uid: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string) {
    try {
      const { uid } = await this.jwtService.verify(token);
      return uid;
    } catch (error) {
      throw new Error('Token inváilido');
    }
  }
}
