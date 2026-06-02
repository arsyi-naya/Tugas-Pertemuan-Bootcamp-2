const express = require("express");
const router = express.Router();

let books = [
    {
        id: 1,
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: 50000,
        stock: 10
    }
];

router.get("/", (req, res) => {
    res.json(books);
});

router.get("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(
        buku => buku.id === id
    );

    if (!book) {
        return res.status(404).json({
            message: "Buku tidak ditemukan"
        });
    }

    res.json(book);

});

router.post("/", (req, res) => {

    const { title, author, price, stock } = req.body;

    const newBook = {
        id: books.length + 1,
        title,
        author,
        price,
        stock
    };

    books.push(newBook);

    res.status(201).json(newBook);

});

router.put("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(
        buku => buku.id === id
    );

    if (!book) {
        return res.status(404).json({
            message: "Buku tidak ditemukan"
        });
    }

    const { title, author, price, stock } = req.body;

    book.title = title;
    book.author = author;
    book.price = price;
    book.stock = stock;

    res.json(book);

});

router.delete("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = books.findIndex(
        buku => buku.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Buku tidak ditemukan"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Buku berhasil dihapus"
    });

});

module.exports = router;