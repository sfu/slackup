module.exports = function(config) {
  if (config.env === 'production') {
    return function(req, res, next) {
      if (req.session && req.session.auth) {
        next()
        return
      }
      req.session.referer = req.url
      res.redirect('login')
    }
  } else if (config.env === 'development') {
    return function(req, res, next) {
      req.session.auth = {
        user: config.user
      }
      next()
      return
    }
  }
}
