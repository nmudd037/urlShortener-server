const express = require('express');

const Link = require('../models/Link');

const router = express.Router();

// @route   GET  /:shortenId
// @desc    Redirect to Original Url
// @access  Public
router.get('/:shortenUrlId', async (req, res) => {
  const { shortenUrlId } = req.params;

  try {
    const link = await Link.findOne({ shortenUrlId });

    if (!link) {
      return res.status(400).send('<h1>Please provide a valid URL! 😓</h1>');
    }

    const { url } = link;
    link.visitors += 1;

    await link.save();

    //res.status(200).json({ url });
    res.redirect(url);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
