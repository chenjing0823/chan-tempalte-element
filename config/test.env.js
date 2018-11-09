'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
})
