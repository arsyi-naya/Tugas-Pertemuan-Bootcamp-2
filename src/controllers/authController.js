const authService = require('../services/authService');
const { registerSchema, loginSchemaFull, changePasswordSchema } = require('../validations/authValidation.js');

const authController = {
    async register(req, res) {
    // 1. Validasi input dengan Zod
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: 'Validasi gagal.',
            errors: validation.error.issues.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
}   

    try {
        const user = await authService.register(validation.data);
        return res.status(201).json({ message: "Registrasi berhasil.", data: user });
    } catch (error) {
        // Tambahkan console.error ini untuk debugging di VS Code / Terminal kamu!
        console.error("DEBUG ERROR REGISTER:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ message: "Email sudah terdaftar." });
        }
        if (error.message === 'FORBIDDEN_ROLE') {
            return res.status(403).json({ message: "Tidak diizinkan membuat akun ADMIN." });
        }
        
        // Jika bukan dua error di atas, server akan mengembalikan 500
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
},

async login(req, res) {
    const validation = loginSchemaFull.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: 'Validasi gagal.',
            errors: validation.error.issues.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    try {
        const tokens = await authService.login(validation.data);
        return res.status(200).json({ message: "Login berhasil.", ... tokens });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ message: "Email atau password salah." });
        }
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
},

async changePassword(req, res) {
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: 'Validasi gagal.',
            errors: validation.error.issues.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    try {
        const result = await authService.changePassword({
            userId: req.user.userId,
            ...validation.data
        });
        return res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_OLD_PASSWORD') {
            return res.status(401).json({ message: "Password lama tidak sesuai." });
        }
        return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    },
async refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        const token = await authService.refreshToken(refreshToken);

        return res.status(200).json(token);

    } catch (error) {

        if (
            error.message === "REFRESH_TOKEN_REQUIRED" ||
            error.message === "INVALID_REFRESH_TOKEN"
        ) {
            return res.status(401).json({
                message: "Refresh token tidak valid"
            });
        }

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
},

};



module.exports = authController;    