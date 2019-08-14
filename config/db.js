const mongoose = require("mongoose");
require("../models/mahasiswa.model");

mongoose.connect(
    "mongodb://localhost:27017/mahasiswaDb",
    { useNewUrlParser: true },
    err => {
        if (!err) {
            console.log("MongoDB Connection Succeeded.");
        } else {
            console.log("Error in DB connection : " + err);
        }
    }
);
