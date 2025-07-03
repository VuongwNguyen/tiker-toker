import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AuthStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  UNVERIFIED = 'unverified',
}

export enum AuthRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Schema()
export class TiktokAccount extends Document {
  @Prop({ required: true })
  tiktokId: string;

  @Prop()
  nickname: string;

  @Prop()
  avatar: string;

  @Prop()
  lastLiveAt: Date;

  @Prop({ default: false })
  isLive: boolean;

  @Prop()
  roomId: string;
}

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: AuthStatus.UNVERIFIED, enum: AuthStatus })
  status: AuthStatus;

  @Prop({})
  currentRefreshToken?: string;

  @Prop({ default: AuthRole.CUSTOMER, enum: AuthRole })
  role: AuthRole;

  @Prop({ default: [], type: [TiktokAccount] })
  TiktokAccounts: TiktokAccount[];
}

const AuthSchema = SchemaFactory.createForClass(Auth);
