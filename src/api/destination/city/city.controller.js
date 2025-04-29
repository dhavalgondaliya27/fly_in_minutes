import { City } from './city.model.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const createCity = asyncHandler(async (req, res) => {
  const { city_name, category_id, sub_category_id, destination_id, status } = req.body;

  if (!city_name || !category_id || !sub_category_id || !destination_id) {
    return res.error(400, 'All fields are required');
  }

  const exists = await City.findOne({ city_name: city_name.trim() });
  if (exists) {
    return res.error(400, 'City already exists');
  }

  const newCity = await City.create({
    city_name: city_name.trim(),
    category_id,
    sub_category_id,
    destination_id,
    status: status || 'active', // default status active
  });

  return res.success(201, newCity, 'City created successfully');
});

const getAllCities = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = {};
  if (status) {
    filter.status = status; // example: active / inactive
  }

  const cities = await City.find(filter)
    .populate('category_id', 'category_name')
    .populate('sub_category_id', 'sub_category_name')
    .populate('destination_id', 'destination_name')
    .sort({ createdAt: -1 });

  return res.success(200, cities, 'Cities fetched successfully');
});

const getCityById = asyncHandler(async (req, res) => {
  const { cityId } = req.params;

  const city = await City.findById(cityId)
    .populate('category_id', 'category_name')
    .populate('sub_category_id', 'sub_category_name')
    .populate('destination_id', 'destination_name');

  if (!city) {
    return res.error(404, 'City not found');
  }

  return res.success(200, city, 'City fetched successfully');
});

const updateCity = asyncHandler(async (req, res) => {
  const { cityId } = req.params;
  const { city_name, category_id, sub_category_id, destination_id, status } = req.body;

  const city = await City.findById(cityId);
  if (!city) {
    return res.error(404, 'City not found');
  }

  if (city_name) city.city_name = city_name.trim();
  if (category_id) city.category_id = category_id;
  if (sub_category_id) city.sub_category_id = sub_category_id;
  if (destination_id) city.destination_id = destination_id;
  if (status) city.status = status; // update status if provided

  await city.save();

  return res.success(200, city, 'City updated successfully');
});

const deleteCity = asyncHandler(async (req, res) => {
  const { cityId } = req.params;

  const city = await City.findByIdAndDelete(cityId);
  if (!city) {
    return res.error(404, 'City not found');
  }

  return res.success(200, null, 'City deleted successfully');
});

export {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
};
