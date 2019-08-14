const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Mahasiswa = mongoose.model("Mahasiswa");

router.get("/", (req, res) => {
    res.render("mahasiswa/addOrEdit", {
        viewTitle: "Insert Data Mahasiswa"
    });
});

router.post("/", (req, res) => {
    if (req.body._id == "") insertRecord(req, res);
    else updateRecord(req, res);
});

function insertRecord(req, res) {
    var mahasiswa = new Mahasiswa();
    mahasiswa.fullName = req.body.fullName;
    mahasiswa.email = req.body.email;
    mahasiswa.phone = req.body.phone;
    mahasiswa.address = req.body.address;
    mahasiswa.save((err, doc) => {
        if (!err) res.redirect("mahasiswa/list");
        else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("mahasiswa/addOrEdit", {
                    viewTitle: "Insert Mahasiswa",
                    mahasiswa: req.body
                });
            } else console.log("Error during record insertion : " + err);
        }
    });
}

function updateRecord(req, res) {
    Mahasiswa.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("mahasiswa/list");
            } else {
                if (err.name == "ValidationError") {
                    handleValidationError(err, req.body);
                    res.render("mahasiswa/addOrEdit", {
                        viewTitle: "Update Mahasiswa",
                        mahasiswa: req.body
                    });
                } else console.log("Error during record update : " + err);
            }
        }
    );
}

router.get("/list", (req, res) => {
    Mahasiswa.find((err, docs) => {
        if (!err) {
            res.render("mahasiswa/list", {
                list: docs
            });
        } else {
            console.log("Error in retrieving mahasiswa list :" + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case "fullName":
                body["fullNameError"] = err.errors[field].message;
                break;
            case "email":
                body["emailError"] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get("/:id", (req, res) => {
    Mahasiswa.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("mahasiswa/addOrEdit", {
                viewTitle: "Update Mahasiswa",
                mahasiswa: doc
            });
        }
    });
});

router.get("/delete/:id", (req, res) => {
    Mahasiswa.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect("/mahasiswa/list");
        } else {
            console.log("Error in mahasiswa delete :" + err);
        }
    });
});

module.exports = router;
