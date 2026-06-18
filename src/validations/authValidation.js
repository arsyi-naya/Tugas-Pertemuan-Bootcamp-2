const { z } = require("zod");

const loginSchema = z.object ({
    email: z.string()
            .email(),
    password: z.string()
                .min(8),
});

const roleEnum = z.enum(["USER", "MODERATOR"]);

const registerSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(8, { message: "Password harus memiliki minimal 8 karakter." }),
    role: z.enum(["USER", "MODERATOR"], {
        errorMap: () => ({ message: "Role hanya boleh USER atau MODERATOR." }),
    }).optional().default("USER"),
});

const loginSchemaFull = z.object({
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, { message: "Password lama tidak boleh kosong." }),
    newPassword: z.string().min(8, { message: "Password baru harus minimal 8 karakter." }),
});

module.exports = { registerSchema, loginSchemaFull, changePasswordSchema };