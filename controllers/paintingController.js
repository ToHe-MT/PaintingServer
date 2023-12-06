const { body, validationResult } = require("express-validator");
const Painting = require("../models/painting");
const Medium = require("../models/medium");
const asyncHandler = require("express-async-handler");
const Pictures = require("../models/image")

// Display list of all .
exports.painting_list = asyncHandler(async (req, res, next) => {
    const allPaintings = await Painting.find({}, "title No status").sort({ No: 1 }).exec();
    res.json(allPaintings);
});

// Display detail page for a specific painting.
exports.painting_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const painting = await Painting.findById(req.params.id)
        .populate("dimension")
        .populate("medium")
        .exec();

    if (painting === null) {
        // No results.
        const err = new Error("Painting not found");
        err.status = 404;
        return next(err);
    }

    res.json(painting)
});
exports.painting_simple = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const painting = await Painting.findById(req.params.id).exec();

    if (painting === null) {
        // No results.
        const err = new Error("Painting not found");
        err.status = 404;
        return next(err);
    }

    res.json(painting)
});


// Display painting create form on GET.
exports.painting_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: painting Create GET")
});

// Custom validation function to check if a value is a valid MongoDB ObjectId or an empty string
const validateBuyer = (value) => {
    // Check if the value is an empty string or a valid MongoDB ObjectId
    if (value === '' || /^[0-9a-fA-F]{24}$/.test(value)) {
        return true; // Validation passed
    }
    return false; // Validation failed
};
const isPositiveInteger = (value) => {
    return /^[1-9]\d*$/.test(value);
};
const isValidMongoIdOrEmpty = (value) => {
    return value === '' || /^[0-9a-fA-F]{24}$/.test(value);
};
// Handle painting create on POST.
exports.painting_create_post = [
    // Validate and sanitize fields.
    body('No')
        .custom(isPositiveInteger)
        .withMessage('Painting number must be a positive integer.'),
    body('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title must be specified.'),
    body('author')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Author must be specified.'),
    body('medium')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Medium must be specified and must not exceed 50 characters.'),
    body('dimension')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Dimension must be specified.'),
    body('price')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Price must be specified.'),
    body('status')
        .isIn(['Maintenance', 'Available', 'Sold'])
        .withMessage('Invalid status.'),
    body('buyer')
        .optional()
        .custom(isValidMongoIdOrEmpty)
        .withMessage('Buyer must be a valid MongoDB ObjectId or an empty string.'),
    body('info').trim(),
    body('pictures')
        .optional()
        .isArray()
        .custom((value) => {
            // Allow an empty array or ensure all elements are valid MongoDB ObjectIds
            if (value.length === 0) {
                return true;
            }
            return value.every((id) => isValidMongoIdOrEmpty(id));
        })
        .withMessage('Invalid picture IDs format.'),
    body('datePurchased')
        .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
        .isISO8601({ strict: false })   // Allows a wider range of date formats
        .toDate()
        .withMessage("Invalid date format."),
    body('dateCreated')
        .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
        .isISO8601({ strict: false })   // Allows a wider range of date formats
        .toDate()
        .withMessage("Invalid date format."),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            try {
                // Create Painting object with escaped and trimmed data
                const painting = new Painting({
                    No: req.body.No,
                    title: req.body.title,
                    author: req.body.author,
                    medium: req.body.medium,
                    dimension: req.body.dimension,
                    price: req.body.price,
                    status: req.body.status,
                    buyer: req.body.buyer,
                    info: req.body.info,
                    pictures: req.body.pictures,
                    dateCreated: req.body.dateCreated,
                    datePurchased: req.body.datePurchased
                });
                const paintingExists = await Painting.findOne({
                    No: req.body.No,
                }).exec();
                if (paintingExists) {
                    return res.status(500).json({
                        error: `Painting No. must be unique, ${req.body.No} have been registered`
                    });
                } else {
                    const savedPainting = await painting.save();
                    console.log(savedPainting)
                    return res.status(201).json(savedPainting._id);
                }
            } catch (error) {
                return res.status(500).json({
                    error: "An error occurred while saving the painting.",
                    message: error
                });
            }
        }
    })
];

// Display painting delete form on GET.
exports.painting_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: painting delete GET");
});

// Handle painting delete on POST.
exports.painting_delete_post = asyncHandler(async (req, res, next) => {
    const painting = await Painting.findById(req.params.id).exec()
    if (painting === null) {
        res.status(500).json({
            error: "Painting not Found",
            navigate: `reload`
        });
        if (painting.pictures) {
            console.log(painting.pictures)
        }
        return;
    }
    await Painting.findByIdAndRemove(req.params.id);
    res.status(200).json({
        success: "Sucessfully Deleted",
        navigate: "/paintings"
    })
});

// Display painting update form on GET.
exports.painting_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: painting update GET");
});

// Handle painting update on POST.
exports.painting_update_post = [
        // Validate and sanitize fields.
        body('No')
            .custom(isPositiveInteger)
            .withMessage('Painting number must be a positive integer.'),
        body('title')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Title must be specified.'),
        body('author')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Author must be specified.'),
        body('medium')
            .trim()
            .isLength({ min: 1, max: 50 })
            .withMessage('Medium must be specified and must not exceed 50 characters.'),
        body('dimension')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Dimension must be specified.'),
        body('price')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Price must be specified.'),
        body('status')
            .isIn(['Maintenance', 'Available', 'Sold'])
            .withMessage('Invalid status.'),
        body('buyer')
            .optional()
            .custom(isValidMongoIdOrEmpty)
            .withMessage('Buyer must be a valid MongoDB ObjectId or an empty string.'),
        body('info').trim(),
        body('pictures')
            .optional()
            .isArray()
            .custom((value) => {
                // Allow an empty array or ensure all elements are valid MongoDB ObjectIds
                if (value.length === 0) {
                    return true;
                }
                return value.every((id) => isValidMongoIdOrEmpty(id));
            })
            .withMessage('Invalid picture IDs format.'),
        body('datePurchased')
            .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
            .isISO8601({ strict: false })   // Allows a wider range of date formats
            .toDate()
            .withMessage("Invalid date format."),
        body('dateCreated')
            .optional({ checkFalsy: true }) // Allows optional and falsy values (e.g., "", null)
            .isISO8601({ strict: false })   // Allows a wider range of date formats
            .toDate()
            .withMessage("Invalid date format."),

        // Process request after validation and sanitization.
        asyncHandler(async (req, res, next) => {
            // Extract the validation errors from a request.
            const painting = new Painting({
                No: req.body.No,
                title: req.body.title,
                author: req.body.author,
                medium: req.body.medium,
                dimension: req.body.dimension,
                price: req.body.price,
                status: req.body.status,
                buyer: req.body.buyer,
                info: req.body.info,
                pictures: req.body.pictures,
                dateCreated: req.body.dateCreated,
                datePurchased: req.body.datePurchased,
                _id: req.params.id
            });
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else {
                try {
                    const paintingExists = await Painting.findOne({
                        No: req.body.No,
                    }).exec();
                    console.log(req.params.id, paintingExists._id)
                    if (paintingExists && (paintingExists._id != req.params.id)) {
                        return res.status(500).json({
                            error: `Painting No. must be unique, ${req.body.No} have been registered`
                        });
                    } else {
                        const updatedPainting = await Painting.findByIdAndUpdate(req.params.id, painting, {});
                        return res.status(201).json(updatedPainting._id);
                    }
                } catch (error) {
                    return res.status(500).json({ error: "An error occurred while saving the dimension." });
                }

            }
        })
    ];
