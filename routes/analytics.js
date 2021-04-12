const express = require('express');

const router = express.Router();
const Link = require('../models/Link');

// @route   GET  api/analytics
// @desc    Get analytics for the link
// @access  Public
router.get('/:shortenUrlId', async (req, res) => {
  // Finds if the Id matches the existing url
  const { shortenUrlId } = req.params;
  try {
    const link = await Link.findOne({ shortenUrlId });

    if (!link) {
      return res.status(400).json({
        msg: 'Please provide a registered Shortened URL, to get the analytics'
      });
    }

    const { visitors, date } = link;
    const formatDate = new Date(`${date}`);
    const timestamp = formatDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
    res.status(200).json({ visitors, timestamp });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
