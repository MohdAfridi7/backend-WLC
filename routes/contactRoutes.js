const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} = require("../controllers/contactController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Public
router.post(
  "/create",
  createContact
);

// Protected
router.get(
  "/all",
  protect,
  getAllContacts
);

router.get(
  "/:id",
  protect,
  getContactById
);

router.delete(
  "/delete/:id",
  protect,
  deleteContact
);

module.exports = router;