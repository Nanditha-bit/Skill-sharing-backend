import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, languages } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, role, languages });
  const token = genToken(user._id);
  res.json({ user: { ...user.toObject(), password: undefined }, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = genToken(user._id);
  res.json({ user: { ...user.toObject(), password: undefined }, token });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
