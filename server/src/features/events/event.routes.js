const express = require('express');
const router = express.Router();
const { getEventsList, getSingleEvent, createEventRecord, updateEventRecord, removeEventRecord } = require('./event.controller');
const { authenticateUser, verifyAdminStatus } = require('../../middleware/auth.middleware');

router.get('/', getEventsList);
router.get('/:id', getSingleEvent);
router.post('/', authenticateUser, verifyAdminStatus, createEventRecord);
router.put('/:id', authenticateUser, verifyAdminStatus, updateEventRecord);
router.delete('/:id', authenticateUser, verifyAdminStatus, removeEventRecord);

module.exports = router;
