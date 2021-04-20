const express = require("express");
const router = express.Router();

router.get("/", async(req, res) => {
    if (req.session.user) {
        return res.render("home");
    }

    return res.render("login");
});

module.exports = router;