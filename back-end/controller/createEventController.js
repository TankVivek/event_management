const Event = require('../model/eventModel');

const createEvents = async (req, res) => {
  const { title, description, location, startDate, endDate } = req.body;
  const image = req.file ? req.file.path : null; // Get the path of the uploaded file

  try {
    const newEvent = new Event({
      title,
      description,
      location,
      startDate,
      endDate,
      image,
    });

    await newEvent.save();
    res.status(201).json({
      success: true,
      data: newEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {createEvents , listEvents };
