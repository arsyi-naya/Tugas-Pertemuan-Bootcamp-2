const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Manajemen Buku API',
            version: '1.0.0',
            description: 'Dokumentasi API manajemen buku',
        },
        servers: [
            {
                url: 'https://tugas-pertemuan-bootcamp-6-production.up.railway.app', 
                description: 'Production Server (Railway)'
            },
            {
                url: 'http://localhost:8080',
                description: 'Local Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        paths: {
            '/health': {
                get: {
                    summary: 'Mengecek status kesehatan server backend',
                    responses: {
                        200: { description: 'Server berjalan dengan baik' }
                    }
                }
            },
            '/api/auth/register': {
                post: {
                    summary: 'Registrasi user baru',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        email: { type: 'string' },
                                        password: { type: 'string' },
                                        role: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Registrasi berhasil' }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    summary: 'Login user',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' },
                                        password: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login berhasil' }
                    }
                }
            },
            '/api/auth/token/refresh': {
                post: {
                    summary: 'Refresh access token',
                    tags: ['Authentication'],
                    responses: {
                        200: { description: 'Access token baru berhasil dibuat' }
                    }
                }
            },
            '/api/auth/profile': {
                get: {
                    summary: 'Lihat profile user',
                    tags: ['Authentication'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Data profile user berhasil diambil' }
                    }
                }
            },
            '/api/auth/change-password': {
                put: {
                    summary: 'Ganti password',
                    tags: ['Authentication'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Password berhasil diubah' }
                    }
                }
            },
            '/api/auth/admin/dashboard': {
                get: {
                    summary: 'Dashboard khusus admin',
                    tags: ['Authentication'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Dashboard admin berhasil diakses' }
                    }
                }
            },
            '/api/auth/content/review': {
                get: {
                    summary: 'Review konten moderator dan admin',
                    tags: ['Authentication'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Konten review berhasil diakses' }
                    }
                }
            }
        }
    },
    apis: [], // Dikosongkan karena semua konfigurasi path sudah dipindahkan ke atas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;