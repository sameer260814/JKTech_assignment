import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }
    
    async validateOAuthLogin(profile: any, provider: 'google' | 'facebook') {
        const { id: providerId, emails, displayName } = profile;
        const email = emails[0]?.value;

        let user = await this.userService.getUserByEmail(email);
        if(!user) {
            user =  await this.userService.createUser({
                email,
                name: displayName,
                providerId,
                provider
            })
        }
        const payload = { id: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
            user
        }
    }
}
