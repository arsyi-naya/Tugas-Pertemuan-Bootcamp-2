const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository.js');

const authService = {
    async register({ email, password, role }) {
        // 1. Cek apakah email sudah terdaftar
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }

        // 2. Jangan izinkan pendaftaran dengan role ADMIN dari endpoint publik
        if (role === 'ADMIN') {
            throw new Error('FORBIDDEN_ROLE');
        }

        // 3. Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Simpan user baru ke database via repository
        const newUser = await userRepository.create({
            email,
            password: hashedPassword,
            role: role || 'USER'
        });

        // PERBAIKAN: Langsung return objek newUser, atau gunakan optional chaining (?)
        // untuk menghindari crash jika properti id/email/role tidak langsung terbaca.
        return newUser; 
    },
    async login({ email, password }) {
    // 1. Cari user berdasarkan email
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // 2. Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Generate Access Token (payload minimal, tanpa data sensitif)
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // 4. Generate Refresh Token
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // 5. Simpan refresh token ke database
    await userRepository.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
    },

    async changePassword({ userId, oldPassword, newPassword }) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error('USER_NOT_FOUND');

        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) throw new Error('INVALID_OLD_PASSWORD' );

        const hashedNew = await bcrypt.hash(newPassword, 12);
        await userRepository.update(userId, { password: hashedNew });

        return { message: 'Password berhasil diubah.' };
    },
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("REFRESH_TOKEN_REQUIRED");
        }

        const user = await userRepository.findByRefreshToken(refreshToken);

        if (!user) {
        throw new Error("INVALID_REFRESH_TOKEN");
        }

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
                process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m"
            }
        );

        return {
            accessToken: newAccessToken
        };
    },
};

module.exports = authService;