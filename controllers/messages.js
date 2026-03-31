const Message = require('../schemas/messages');

exports.getMessagesWithUser = async (req, res) => {
  try {
    const currentUser = req.user.id; // Assuming auth middleware sets req.user
    const userID = req.params.userID;
    const messages = await Message.find({
      $or: [
        { from: currentUser, to: userID },
        { from: userID, to: currentUser }
      ]
    }).sort({ createdAt: 1 }).populate('from to', 'name email'); // Populate user details if needed
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { to, type, text } = req.body;
    const from = req.user.id;
    const message = new Message({
      from,
      to,
      messageContent: { type, text }
    });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLastMessages = async (req, res) => {
  try {
    const currentUser = req.user.id;
    // Get all users who have messaged with currentUser
    const fromUsers = await Message.distinct('from', { to: currentUser });
    const toUsers = await Message.distinct('to', { from: currentUser });
    const allUsers = [...new Set([...fromUsers, ...toUsers])];

    const lastMessages = [];
    for (const user of allUsers) {
      const lastMsg = await Message.findOne({
        $or: [
          { from: currentUser, to: user },
          { from: user, to: currentUser }
        ]
      }).sort({ createdAt: -1 }).populate('from to', 'name email');
      if (lastMsg) lastMessages.push(lastMsg);
    }
    res.json(lastMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};