const BigPromise = require("../middlewares/bigPromise");

exports.testProduct = BigPromise(async(req,res) => {
    // const db = await something()
    res.status(200).json({
        success: true,
        greeting: "this is test for product"
    });
})