module.exports = function(cas, config) {
  if (config.env === 'development') {
    return function(req, res, next) {
      next()
    }
  } else if (config.env === 'production') {
    return cas.getMiddleware(config.cas)
  }
}
