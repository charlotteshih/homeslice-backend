process.env.TZ = 'UTC'
process.env.NODE_ENV = 'development'
process.env.JWT_SECRET = 'gimme_that_good_za'
process.env.TEST_DB_URL = process.env.TEST_DB_URL || "postgresql://homeslice@localhost/homeslice-test"

require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
