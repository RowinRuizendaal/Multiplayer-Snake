const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const { uuid } = require("uuidv4");

router.get("/", (req, res) => {
    res.redirect("lobby");
});

router.post("/game", async(req, res) => {
    nickname = req.body.nickname.toLowerCase();

    if (nickname === "" || !nickname || nickname === undefined) {
        return res.redirect("lobby");
    }

    if (req.session.user) {
        return res.redirect("lobby");
    }

    const db = firebase.firestore();
    const data = db.collection("users");
    const snapshot = await data.where("username", "==", nickname).get();
    const empty = snapshot.empty;
    const uniqueid = uuid();

    if (empty) {
        await data.doc(uniqueid).set({
            username: nickname.toLowerCase(),
            wins: 0,
        });

        req.session.user = {
            id: uniqueid,
            data: {
                wins: 0,
                username: nickname,
            },
        };
        req.session.save();
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