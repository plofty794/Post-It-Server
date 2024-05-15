import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import env from '@utils/envalid';

const userSchema = new Schema(
  {
    username: { type: String, unique: true, trim: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    firstName: { type: String, trim: true, sparse: true },
    lastName: { type: String, trim: true, sparse: true },
    fullName: { type: String, trim: true, sparse: true },
    about: { type: String, trim: true, sparse: true },
    profilePicUrl: { type: String },
    password: { type: String, select: false },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'SavedPosts' }],
    hiddenPosts: [{ type: Schema.Types.ObjectId, ref: 'HiddenPosts' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password) {
    const hashedPassword = await bcrypt.hash(this.password, env.ROUNDS);
    this.password = hashedPassword;
  }
  next();
});

const UserSchema = model('Users', userSchema);

export default UserSchema;
