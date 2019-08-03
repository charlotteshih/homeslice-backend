module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DBASE_URL || 'postgresql://homeslice@localhost/homeslice',
    JWT_SECRET: process.env.JWT_SECRET || 'gimme_that_good_za',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h'
};