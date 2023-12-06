const { body, validationResult } = require("express-validator");
const Buyer = require("../models/buyer");
const mongoose = require("mongoose")
// const Book = require('../models/book')
const asyncHandler = require("express-async-handler");

// Display list of all buyers.
exports.buyer_list = asyncHandler(async (req, res, next) => {
  const allBuyers = await Buyer.find({}, "name address").sort({ name: 1 }).exec()
  res.send(allBuyers);
});

// Display detail page for a specific buyer.
exports.buyer_detail = asyncHandler(async (req, res, next) => {
  const buyer = await Buyer.findById(req.params.id).populate({
    path: "wishlist",
    select: "No title _id"
  }).exec();
  if (buyer === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }
  res.send(buyer)
});

exports.buyer_simple = asyncHandler(async (req, res, next) => {
  const buyer = await Buyer.findById(req.params.id).exec()
  if (buyer === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }
  res.send(buyer)
});
// Display buyer create form on GET.
exports.buyer_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: buyer create GET");
});

// Handle buyer create on POST.
exports.buyer_create_post = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name must be specified."),
  body("address.country").trim().isLength({ min: 1 }).withMessage("Country must be specified."),
  body("address.city").trim().isLength({ min: 1 }).withMessage("City must be specified."),
  body("address.street").trim().isLength({ min: 1 }).withMessage("Street must be specified."),
  body("address.postalCode").trim().isLength({ min: 1 }).withMessage("Postal code must be specified."),
  body("email").trim().isEmail().withMessage("Invalid email format."),
  body("phoneNumber").trim().isLength({ min: 1 }).withMessage("Phone number must be specified."),
  body("dob")
  .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
  .isISO8601({ strict: false })   // Allows a wider range of date formats
  .toDate()
  .withMessage("Invalid date format."),
  body("currency").isString().withMessage("Currency must be a string."),
  body("length").isString().withMessage("Length must be a string."),
  body("wishlist").isArray().withMessage("Wishlist must be an array."),
  body("wishlist.*").isMongoId().withMessage("Invalid painting ID format."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const ObjectId = mongoose.Types.ObjectId
    // Create Author object with escaped and trimmed data
    const {
      name,
      email,
      phoneNumber,
      dob,
      currency,
      length,
      address,
      wishlist
    } = req.body;
    // Check if DOB is blank or not provided
    let dateOfBirth = null; // Default value for DOB

    if (dob) {
      dateOfBirth = new Date(dob);
    }
    const wishlistObjectIds = wishlist.map(paintingId => new ObjectId(paintingId));
    const buyer = new Buyer({
      name,
      address: address,
      email,
      phoneNumber,
      dateOfBirth: dateOfBirth, // Assuming dob is in YYYY-MM-DD format
      wishlist: wishlistObjectIds,
      currency,
      lengthPreferences: length.toLowerCase()
    });
    console.log(buyer)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {

        const savedBuyer = await buyer.save();
        return res.status(201).json(savedBuyer._id);
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving the dimension." });
      }
    }
  })
];

// Display buyer delete form on GET.
exports.buyer_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: buyer delete GET");
});

// Handle buyer delete on POST.
exports.buyer_delete_post = asyncHandler(async (req, res, next) => {
  const buyer = await Buyer.findById(req.params.id).exec()
  if (buyer === null) {
    res.status(500).json({
      error: "Buyer not Found",
      navigate: `reload`
    });
    return;
  }
  await Buyer.findByIdAndRemove(req.params.id);
  res.status(200).json({
    success: "Sucessfully Deleted",
    navigate: "reload"
  })
});

// Display buyer update form on GET.
exports.buyer_update_get = []

// Handle buyer update on POST.
exports.buyer_update_post = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name must be specified."),
  body("address.country").trim().isLength({ min: 1 }).withMessage("Country must be specified."),
  body("address.city").trim().isLength({ min: 1 }).withMessage("City must be specified."),
  body("address.street").trim().isLength({ min: 1 }).withMessage("Street must be specified."),
  body("address.postalCode").trim().isLength({ min: 1 }).withMessage("Postal code must be specified."),
  body("email").trim().isEmail().withMessage("Invalid email format."),
  body("phoneNumber").trim().isLength({ min: 1 }).withMessage("Phone number must be specified."),
  body("dob")
  .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
  .isISO8601({ strict: false })   // Allows a wider range of date formats
  .toDate()
  .withMessage("Invalid date format."),
  body("currency").isString().withMessage("Currency must be a string."),
  body("length").isString().withMessage("Length must be a string."),
  body("wishlist").isArray().withMessage("Wishlist must be an array."),
  body("wishlist.*").isMongoId().withMessage("Invalid painting ID format."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const ObjectId = mongoose.Types.ObjectId
    // Create Author object with escaped and trimmed data
    const {
      name,
      email,
      phoneNumber,
      dob,
      currency,
      length,
      address,
      wishlist,
      _id
    } = req.body;

    const wishlistObjectIds = wishlist.map(paintingId => new ObjectId(paintingId));
    let dateOfBirth = null; // Default value for DOB

    if (dob) {
      dateOfBirth = new Date(dob);
    }
    const buyer = new Buyer({
      name,
      address: address,
      email,
      phoneNumber,
      dateOfBirth: dateOfBirth, // Assuming dob is in YYYY-MM-DD format
      wishlist: wishlistObjectIds,
      currency,
      lengthPreferences: length.toLowerCase(),
      _id: req.params.id
    });
    console.log(buyer)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {

        const updatedBuyer = await Buyer.findByIdAndUpdate(req.params.id, buyer, {});
        return res.status(201).json(updatedBuyer._id);
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving the dimension." });
      }
    }
  })
];
