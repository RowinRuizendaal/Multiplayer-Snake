const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const { uuid } = require("uuidv4");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/game", async(req, res) => {
    nickname = req.body.nickname.toLowerCase();

    const db = firebase.firestore();
    const data = db.collection("users");
    const snapshot = await data.where("username", "==", nickname).get();

    if (snapshot.empty) {
        await db.collection("users").doc(uuid()).set({
            username: nickname.toLowerCase(),
            wins: 0,
        });

        return res.redirect("lobby");
    }

    snapshot.forEach((doc) => {
        req.session.user = {
            id: doc.id,
            data: doc.data(),
        };
    });
    req.session.save(() => {
        return res.redirect("lobby");
    });
});

module.exports = router;