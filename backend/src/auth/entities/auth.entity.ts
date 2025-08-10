import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as Bcrypt from 'bcryptjs';

export enum AuthStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  UNVERIFIED = 'unverified',
}

export enum AuthRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CUSTOMER = 'customer',
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

export const TiktokAccountSchema = SchemaFactory.createForClass(TiktokAccount);

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({})
  name: string;

  @Prop({ default: AuthStatus.UNVERIFIED, enum: AuthStatus })
  status: AuthStatus;

  @Prop({})
  currentRefreshToken?: string;

  @Prop({ default: AuthRole.CUSTOMER, enum: AuthRole })
  role: AuthRole;

  @Prop({ default: [], type: [TiktokAccount] })
  TiktokAccounts: TiktokAccount[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.pre<Auth>('save', function (next) {
  if (this.isModified('password')) {
    // Hash the password before saving
    this.password = Bcrypt.hashSync(this.password, 10);
  }
  if (this.isModified('email')) {
    this.name = this.email.split('@')[0]; // Set name to the part before '@' in email
  }
  next();
});

AuthSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // Remove password from the output
  delete obj.currentRefreshToken; // Remove currentRefreshToken from the output
  delete obj.__v; // Remove version key from the output
  delete obj.createdAt; // Remove createdAt from the output
  delete obj.updatedAt; // Remove updatedAt from the output
  delete obj.TiktokAccounts; // Remove TiktokAccounts from the output
  delete obj._id; // Remove _id from the output
  delete obj.status;
  return obj;
};
