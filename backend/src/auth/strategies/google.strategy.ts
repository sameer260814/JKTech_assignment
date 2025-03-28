import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class googleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService, configService: ConfigService) {
        super({
            clientId: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('CALLBACK_URL'),
            scope: ['email', 'profile']
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const user = await this.authService.validateOAuthLogin(profile, 'google');
        return done(null, user);
    }
}