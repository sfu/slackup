/* eslint no-console: "off" */

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const config = require('./config/environment')

const app = express()
app.use(express.static(path.join(__dirname,  'public')))
if (config.env === 'production') {
  app.use('/assets', express.static(path.resolve(__dirname, '../build')))
}

app.use('/', require('./routes'))
app.set('trust proxy')
app.use(cookieParser())
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'hbs')

if (config.env === 'development') {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config')
  const compiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
}

app.listen(config.port, () => { console.log(`App listening on port ${config.port}`) })
