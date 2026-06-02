const express = require("express");
const bookRoutes = require("./routes/book.Routes");

const app = express();

app.use(express.json());

app.use("/books", bookRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint tidak ditemukan"
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;