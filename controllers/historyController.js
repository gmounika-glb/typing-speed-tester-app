const History = require('../models/History');
exports.getHistory = async (req, res) => {
  try {
    const {_id} = req?.user;
    const userId = _id;
    const history = await History.find({userId});
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving history', error: error.message});
  }
};
exports.addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const {date, time, elapsedTime, speed, accuracy} = req.body;
    const newHistoryEntry = new History({
      userId,
      date,
      time,
      elapsedTime,
      speed,
      accuracy,
    });
    const savedHistoryEntry = await newHistoryEntry.save();
    res.status(201).json({
      message: 'History entry added successfully',
      historyId: savedHistoryEntry._id,
    });
  } catch (error) {
    res
      .status(400)
      .json({message: 'Error adding history entry', error: error.message});
  }
};
exports.deleteHistory = async (req, res) => {
  try {
    const {historyId} = req.params;
    const userId = req.user.id;
    const deletedHistory = await History.findOneAndDelete({
      _id: historyId,
      userId,
    });
    if (!deletedHistory) {
      return res.status(404).json({message: 'History entry not found'});
    }
    res.status(200).json({message: 'History entry deleted successfully'});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error deleting history entry', error: error.message});
  }
};
