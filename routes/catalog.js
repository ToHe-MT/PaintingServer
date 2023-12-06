var express = require('express');
var router = express.Router();

const buyer_controller = require("../controllers/buyerController");
const dimension_controller = require("../controllers/dimensionController");
const medium_controller = require("../controllers/mediumController");
const painting_controller = require("../controllers/paintingController");


router.get('/painting/create', painting_controller.painting_create_get);

// POST request for creating painting.
router.post("/painting/create", painting_controller.painting_create_post);

// GET request to delete painting.
router.get("/painting/:id/delete", painting_controller.painting_delete_get);

// POST request to delete painting.
router.post("/painting/:id/delete", painting_controller.painting_delete_post);

// GET request to update painting.
router.get("/painting/:id/update", painting_controller.painting_update_get);

// POST request to update painting.
router.post("/painting/:id/update", painting_controller.painting_update_post);

// GET request for one painting.
router.get("/painting/:id", painting_controller.painting_detail);
router.get("/painting/:id/simple", painting_controller.painting_simple);

// GET request for list of all painting items.
router.get("/paintings", painting_controller.painting_list);

/// medium ROUTES ///

// GET request for creating medium. NOTE This must come before route for id (i.e. display medium).
router.get("/medium/create", medium_controller.medium_create_get);

// POST request for creating medium.
router.post("/medium/create", medium_controller.medium_create_post);

// GET request to delete medium.
router.get("/medium/:id/delete", medium_controller.medium_delete_get);

// POST request to delete medium.
router.post("/medium/:id/delete", medium_controller.medium_delete_post);

// GET request to update medium.
router.get("/medium/:id/update", medium_controller.medium_update_get);

// POST request to update medium.
router.post("/medium/:id/update", medium_controller.medium_update_post);

// GET request for one medium.
router.get("/medium/:id", medium_controller.medium_detail);
router.get("/medium/:id/simple", medium_controller.medium_simple);

// GET request for list of all mediums.
router.get("/mediums", medium_controller.medium_list);

/// dimension ROUTES ///

// GET request for creating a dimension. NOTE This must come before route that displays dimension (uses id).
router.get("/dimension/create", dimension_controller.dimension_create_get);

//POST request for creating dimension.
router.post("/dimension/create", dimension_controller.dimension_create_post);

// GET request to delete dimension.
router.get("/dimension/:id/delete", dimension_controller.dimension_delete_get);

// POST request to delete dimension.
router.post("/dimension/:id/delete", dimension_controller.dimension_delete_post);

// GET request to update dimension.
router.get("/dimension/:id/update", dimension_controller.dimension_update_get);

// POST request to update dimension.
router.post("/dimension/:id/update", dimension_controller.dimension_update_post);

// GET request for one dimension.
router.get("/dimension/:id", dimension_controller.dimension_detail);
router.get("/dimension/:id/simple", dimension_controller.dimension_simple);

// GET request for list of all dimension.
router.get("/dimensions", dimension_controller.dimension_list);

/// buyer ROUTES ///

// GET request for creating a buyer. NOTE This must come before route that displays buyer (uses id).
router.get(
    "/buyer/create",
    buyer_controller.buyer_create_get
);

// POST request for creating buyer.
router.post(
    "/buyer/create",
    buyer_controller.buyer_create_post
);

// GET request to delete buyer.
router.get(
    "/buyer/:id/delete",
    buyer_controller.buyer_delete_get
);

// POST request to delete buyer.
router.post(
    "/buyer/:id/delete",
    buyer_controller.buyer_delete_post
);

// GET request to update buyer.
router.get(
    "/buyer/:id/update",
    buyer_controller.buyer_update_get
);

// POST request to update buyer.
router.post(
    "/buyer/:id/update",
    buyer_controller.buyer_update_post
);

// GET request for one buyer.
router.get("/buyer/:id", buyer_controller.buyer_detail);
router.get("/buyer/:id/simple", buyer_controller.buyer_simple);

// GET request for list of all buyer.
router.get("/buyers", buyer_controller.buyer_list);

module.exports = router;
