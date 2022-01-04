const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

module.exports = router;
