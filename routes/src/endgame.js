const express = require("express");
const router = express.Router();
const firebase = require("firebase");

router.post("/endgame", async(req, res) => {
    nickname = req.session.user.id;

    const db = firebase.firestore();
    const data = db.collection("users").doc(nickname);
    const update = await data.update({
        wins: req.session.user.data.wins + 1,
    });
});

module.exports = router;