const express = require('express');
const { check, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const dns = require('dns');
const Link = require('../models/Link');

const router = express.Router();

// @route   GET  api/shorten
// @desc    Get Shortened Link
// @access  Public
router.post(
  '/',
  [check('url', 'Please provide a valid URL').isURL()],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsarr = errors.array();
      const { msg } = errorsarr[0];
      return res.status(400).json({ msg });
    }

    const { url } = req.body;
    const urlObj = new URL(url);

    await dns.lookup(urlObj.host, async function (error) {
      if (error) {
        return res
          .status(400)
          .json({ msg: 'Please provide URL from a valid domain' });
      }

      const shortenUrlId = nanoid(12); // 12 gives a 1% probability of atleast 1 collision in 1000 years

      try {
        await Link.create({
          url,
          shortenUrlId
        });

        const shortenUrl = `${req.protocol}://${req.get(
          'host'
        )}/${shortenUrlId}`;
        res.status(200).json({ shortenUrl });
      } catch (err) {
        res.status(500).send('Server Error');
      }
    });
  }
);

module.exports = router;
