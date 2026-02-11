const express = require("express");
const {
    createOrder,
    capturePaymentAndFinalizeOrder,
} = require("../../controller/student-controller/order-controller");

const router = express.Router();

router.post("/order/create", createOrder);
router.post("/order/capture", capturePaymentAndFinalizeOrder);

module.exports = router;