const { body, validationResult } = require("express-validator");
const Medium = require("../models/medium");
const Painting = require("../models/painting")
const asyncHandler = require("express-async-handler");

// Display list of all mediums.
exports.medium_list = asyncHandler(async (req, res, next) => {
  const allMediums = await Medium.find().sort({ name: 1 }).exec();
  res.setHeader('Content-Type', 'application/json');

  res.json(allMediums);
});

// Display detail page for a specific medium.
exports.medium_detail = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const [medium, paintings] = await Promise.all([
    Medium.findById(req.params.id).exec(),
    Painting.find({ medium: req.params.id }).exec(),
  ]);

  if (medium === null) {
    // No results.
    const err = new Error("Medium not found");
    err.status = 404;
    return next(err);
  }

  res.json({ medium: medium, paintings: paintings });
});

exports.medium_simple = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const medium = await Medium.findById(req.params.id).exec()

  if (medium === null) {
    // No results.
    const err = new Error("Medium not found");
    err.status = 404;
    return next(err);
  }

  res.json({ medium: medium });
});


// Display medium create form on GET.
exports.medium_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: medium create GET");
});

// Handle medium create on POST.
exports.medium_create_post = [
  // Validate and sanitize fields.
  body("tools")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Tools must be specified."),
  body("brand")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand must be specified.")
    .isLength({ max: 50 })
    .withMessage("Brand must not exceed 50 characters."),
  body("info").trim(),
  body("paper.gsm")
    .isInt({ min: 1 })
    .withMessage("GSM must be a positive integer."),
  body("paper.type")
    .isIn(["watercolor", "cold pressed", "hot pressed", "canvas"])
    .withMessage("Invalid paper type."),
  body("paper.isFullCotton").toBoolean(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const medium = new Medium({
      tools: req.body.tools,
      brand: req.body.brand,
      info: req.body.info,
      paper: {
        gsm: req.body.paper.gsm,
        type: req.body.paper.type,
        isFullCotton: req.body.paper.isFullCotton,
      },
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const savedMedium = await medium.save();
        return res.status(201).json(savedMedium._id);
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving the dimension." });
      }
    }
  })
];

// Display medium delete form on GET.
exports.medium_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: medium delete GET");
});

// Handle medium delete on POST.
exports.medium_delete_post = asyncHandler(async (req, res, next) => {
  const [medium, paintings] = await Promise.all([
    Medium.findById(req.params.id).exec(),
    Painting.find({ medium: req.params.id }).exec(),
  ]);
  if (paintings.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.status(500).json({
      error: "Painting registered with these medium should be first deleted",
      navigate: `../medium/${req.params.id}`
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Medium.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: "Sucessfully Deleted",
      navigate: "/mediums"
    })
  }
});

// Display medium update form on GET.
exports.medium_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: medium update POST");
});

// Handle medium update on POST.
exports.medium_update_post = [
  body("tools")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Tools must be specified."),
  body("brand")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand must be specified.")
    .isLength({ max: 50 })
    .withMessage("Brand must not exceed 50 characters."),
  body("info").trim(),
  body("paper.gsm")
    .isInt({ min: 1 })
    .withMessage("GSM must be a positive integer."),
  body("paper.type")
    .isIn(["watercolor", "cold pressed", "hot pressed", "canvas"])
    .withMessage("Invalid paper type."),
  body("paper.isFullCotton").toBoolean(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const medium = new Medium({
      tools: req.body.tools,
      brand: req.body.brand,
      info: req.body.info,
      paper: {
        gsm: req.body.paper.gsm,
        type: req.body.paper.type,
        isFullCotton: req.body.paper.isFullCotton,
      },
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const updatedMedium = await Medium.findByIdAndUpdate(req.params.id, medium, {});
        return res.status(201).json(updatedMedium._id);
      } catch (error) {
        2
        return res.status(500).json({ error: "An error occurred while saving the medium." });
      }
    }
  })
];


