const app = require('./app.js');
const PORT = process.env.PORT || 8080; 

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Manajemen Buku berjalan di port ${PORT}`);
});