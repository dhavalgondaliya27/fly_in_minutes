import { Destination } from './destination.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const createDestination = asyncHandler(async (req, res) => {
  const { destination_name } = req.body;

  if (!destination_name) {
    return res.error(400, 'Destination name is required');
  }

  const exists = await Destination.findOne({ destination_name: destination_name.trim(), status: 1 });
  if (exists) {
    return res.error(400, 'Destination already exists');
  }

  const newDestination = await Destination.create({
    destination_name: destination_name.trim(),
    status: 1, // default active
  });

  return res.success(201, newDestination, 'Destination created successfully');
});

const getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ status: 1 }).sort({ createdAt: -1 });
  return res.success(200, destinations, 'Destinations fetched successfully');
});

const getDestinationById = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;

  const destination = await Destination.findOne({ _id: destinationId, status: 1 });
  if (!destination) {
    return res.error(404, 'Destination not found');
  }

  return res.success(200, destination, 'Destination fetched successfully');
});

const updateDestination = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;
  const { destination_name } = req.body;

  const destination = await Destination.findOne({ _id: destinationId, status: 1 });
  if (!destination) {
    return res.error(404, 'Destination not found');
  }

  if (destination_name) destination.destination_name = destination_name.trim();
  await destination.save();

  return res.success(200, destination, 'Destination updated successfully');
});

const deleteDestination = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;

  const destination = await Destination.findOne({ _id: destinationId, status: 1 });
  if (!destination) {
    return res.error(404, 'Destination not found');
  }

  destination.status = 0;
  await destination.save();

  return res.success(200, null, 'Destination deleted successfully');
});

export {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
