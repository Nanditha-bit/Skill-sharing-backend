import asyncHandler from 'express-async-handler';
import Workshop from '../models/Workshop.js';

export const createWorkshop = asyncHandler(async (req, res) => {
  const data = { ...req.body, instructor: req.user._id };
  const ws = await Workshop.create(data);
  res.status(201).json(ws);
});

export const listWorkshops = asyncHandler(async (req, res) => {
  const { q, language } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (language) filter.language = language;
  const items = await Workshop.find(filter).populate('instructor', 'name');
  res.json(items);
});

export const getWorkshop = asyncHandler(async (req, res) => {
  const item = await Workshop.findById(req.params.id).populate('instructor', 'name');
  if (!item) { res.status(404); throw new Error('Workshop not found'); }
  res.json(item);
});
