// Ambil Semua Buku
const prisma = require("../config/prisma"); 
const getAllBooks = async (req, res) => { 
  try { 
    const books = await prisma.book.findMany(); 
    res.status(200).json({ 
      status: "success", 
      data: books, 
    }); 
  } catch (error) { 
    res.status(500).json({ status: "error", message: error.message }); 
  } 
};

//  Ambil Satu Buku Berdasarkan ID 
const getBookById = async (req, res) => { 
  try { 
    const { id } = req.params; 
    const book = await prisma.book.findUnique({ 
      where: { id: Number(id) }, // ID dari URL selalu string, konversi ke Number
    }); 
 
    if (!book) { 
      return res.status(404).json({ status: "error", message: "Buku tidak ditemukan." }); 
    } 
 
    res.status(200).json({ status: "success", data: book }); 
  } catch (error) { 
    res.status(500).json({ status: "error", message: error.message }); 
  } 
};

//Tambah Buku Baru
const createBook = async (req, res) => { 
  try { 
    const { title, author, price, stock } = req.body; 
    const newBook = await prisma.book.create({ 
      data: { 
        title, 
        author, 
        price, 
        stock, 
      }, 
    }); 
 
    res.status(201).json({ status: "success", data: newBook }); 
  } catch (error) { 
    res.status(500).json({ status: "error", message: error.message }); 
  } 
};

// Perbarui Data Buku 
const updateBook = async (req, res) => { 
  try { 
    const { id } = req.params; 
    const { title, author, price, stock } = req.body; 
 
    const updatedBook = await prisma.book.update({ 
      where: { id: Number(id) }, 
      data: { title, author, price, stock }, 
    }); 
 
    res.status(200).json({ status: "success", data: updatedBook }); 
  } catch (error) { 
    // Kode P2025 adalah error Prisma saat record tidak ditemukan 
    if (error.code === "P2025") { 
      return res.status(404).json({ status: "error", message: "Buku tidak  ditemukan." }); 
    } 
    res.status(500).json({ status: "error", message: error.message }); 
  } 
};

// Hapus Buku 
const deleteBook = async (req, res) => { 
  try { 
    const { id } = req.params; 
    await prisma.book.delete({ 
      where: { id: Number(id) }, 
    }); 
    res.status(200).json({ status: "success", message: "Buku berhasil dihapus." }); 
  } catch (error) { 
    if (error.code === "P2025") { 
      return res.status(404).json({ status: "error", message: "Buku tidak ditemukan." }); 
    } 
    res.status(500).json({ status: "error", message: error.message }); 
  } 
}; 
 
module.exports = { getAllBooks, getBookById, createBook, updateBook, 
deleteBook }; 