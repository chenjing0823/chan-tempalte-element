'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_API: '"https://easy-mock.com/mock/5be525753f52ab2b28805f9e/chan-template"',
})
