module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://homeslice@localhost/homeslice',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://homeslice@localhost/homeslice-test',
    JWT_SECRET: process.env.JWT_SECRET || 'gimme_that_good_za',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h'
};