import { User } from '../models/user.model.js';

export class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email, includePassword = false) {
    if (includePassword) {
      return await User.findOne({ email }).select('+password');
    }
    return await User.findOne({ email });
  }

  async findByVerificationToken(token) {
    return await User.findOne({ verificationToken: token }).select('+verificationToken');
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

export const userRepository = new UserRepository();
