const express = require("express");
const router = express.Router();
const firebase = require("firebase");

router.get("/lobby", async(req, res) => {
    if (req.session.user) {
        const db = firebase.firestore();
        let data = await db
            .collection("users")
            .where("wins", ">", 0)
            .orderBy("wins", "desc")
            .limit(10)
            .get();

        data = data.docs.map((doc) => doc.data());

        return res.render("home.ejs", {
            data: data,
        });
    }

    return res.render("home");
});

module.exports = router;