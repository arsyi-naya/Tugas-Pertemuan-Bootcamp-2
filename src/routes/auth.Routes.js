const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @openapi
 * /api/auth/register:
 * post:
 * summary: Registrasi user baru
 * tags:
 * - Authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * role:
 * type: string
 * responses:
 * 201:
 * description: Registrasi berhasil
 */

router.post("/register", authController.register);

/**
 * @openapi
 * /api/auth/login:
 * post:
 * summary: Login user
 * tags:
 * - Authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login berhasil
 */

router.post("/login", authController.login);

/**
 * @openapi
 * /api/auth/token/refresh:
 * post:
 * summary: Refresh access token
 * tags:
 * - Authentication
 * responses:
 * 200:
 * description: Access token baru berhasil dibuat
 */

router.post("/token/refresh", authController.refreshToken);

/**
 * @openapi
 * /api/auth/profile:
 * get:
 * summary: Lihat profile user
 * tags:
 * - Authentication
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Data profile user
 */

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.json({
      message: "Selamat datang!",
      user: req.user,
    });
  }
);

/**
 * @openapi
 * /api/auth/change-password:
 * put:
 * summary: Ganti password
 * tags:
 * - Authentication
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Password berhasil diubah
 */

router.put(
  "/change-password",
  authenticate,
  authController.changePassword
);

/**
 * @openapi
 * /api/auth/admin/dashboard:
 * get:
 * summary: Dashboard khusus admin
 * tags:
 * - Authentication
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Dashboard admin berhasil diakses
 */

router.get(
  "/admin/dashboard",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      message: "Dashboard admin.",
    });
  }
);

/**
 * @openapi
 * /api/auth/content/review:
 * get:
 * summary: Review konten moderator dan admin
 * tags:
 * - Authentication
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Konten review berhasil diakses
 */

router.get(
  "/content/review",
  authenticate,
  authorize("ADMIN", "MODERATOR"),
  (req, res) => {
    res.json({
      message: "Konten untuk direview.",
    });
  }
);

module.exports = router;