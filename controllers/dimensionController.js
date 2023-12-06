const { body, validationResult } = require("express-validator");
const Painting = require("../models/painting")
const Dimension = require("../models/dimension");
const asyncHandler = require("express-async-handler");

// Display list of all dimensions.
exports.dimension_list = asyncHandler(async (req, res, next) => {
  const allDimension = await Dimension.find().sort({ name: 1 }).exec();
  res.send(allDimension);
});

// Display detail page for a specific dimension.
exports.dimension_detail = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const [dimension, paintings] = await Promise.all([
    Dimension.findById(req.params.id).exec(),
    Painting.find({ dimension: req.params.id }).exec(),
  ]);

  if (dimension === null) {
    // No results.
    const err = new Error("Dimension not found");
    err.status = 404;
    return next(err);
  }

  res.send({ dimension: dimension, paintings })
});

exports.dimension_simple = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const dimension= await Dimension.findById(req.params.id).exec();

  if (dimension === null) {
    // No results.
    const err = new Error("Dimension not found");
    err.status = 404;
    return next(err);
  }

  res.send({ dimension: dimension })
});

// Display dimension create form on GET.
exports.dimension_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: dimension create GET");
});

// Handle dimension create on POST.
exports.dimension_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be specified."),
  body("height")
    .isNumeric()
    .withMessage("Height must be a numeric value.")
    .custom((value, { req }) => value > 0)
    .withMessage("Height must be a positive number."),
  body("width")
    .isNumeric()
    .withMessage("Width must be a numeric value.")
    .custom((value, { req }) => value > 0)
    .withMessage("Width must be a positive number."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { name, height, width } = req.body;

    const newDimension = new Dimension({
      name: name,
      height: parseFloat(height),
      width: parseFloat(width),
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const dimensionExists = await Dimension.findOne({
          name: name,
        }).exec();
        if (dimensionExists) {
          return res.status(500).json({
            error: `Dimension must be Unique, ${name} have been registered `
          });
        } else {
          const savedDimension = await newDimension.save();
          console.log(savedDimension)
          return res.status(201).json(savedDimension._id);
        }
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving the dimension." });
      }
    }
  }),
];

// Display dimension delete form on GET.
exports.dimension_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: dimension delete GET");
});

// Handle dimension delete on POST.
exports.dimension_delete_post = asyncHandler(async (req, res, next) => {
  const [dimension, paintings] = await Promise.all([
    Dimension.findById(req.params.id).exec(),
    Painting.find({ dimension: req.params.id }).exec(),
  ]);
  if (paintings.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.status(500).json({
      error: "Painting registered with these dimension should be first deleted",
      navigate: `../dimension/${req.params.id}`
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Dimension.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: "Sucessfully Deleted",
      navigate: "/dimensions"
    })
  }
});

// Display dimension update form on GET.
exports.dimension_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: dimension update GET");
});

// Handle dimension update on POST.
exports.dimension_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be specified."),
  body("height")
    .isNumeric()
    .withMessage("Height must be a numeric value.")
    .custom((value, { req }) => value > 0)
    .withMessage("Height must be a positive number."),
  body("width")
    .isNumeric()
    .withMessage("Width must be a numeric value.")
    .custom((value, { req }) => value > 0)
    .withMessage("Width must be a positive number."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { name, height, width } = req.body;

    const newDimension = new Dimension({
      name: name,
      height: parseFloat(height),
      width: parseFloat(width),
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const dimensionExists = await Dimension.findOne({
          name: name,
        }).exec();
        if (dimensionExists && (dimensionExists._id != req.params.id)) {
          return res.status(500).json({
            error: `Dimension must be Unique, ${name} have been registered `
          });
        } else {
          const updatedDimension = await Dimension.findByIdAndUpdate(req.params.id, newDimension, {});
          return res.status(201).json(updatedDimension._id);
        }
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving the dimension." });
      }
    }
  }),
];