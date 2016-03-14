const express = require('express')
const router = express.Router()
const session = require('express-session')
const json = require('body-parser').json
const config = require('./config/environment')
const cas = require('cas-sfu')
const loggedin = require('./lib/loggedin')(config)
const casauth = require('./lib/casauth')(cas, config)
const invite = require('./lib/slack-invite')

router.use(session({
  secret: process.env.SESSION_SECRET || 'wharrrrrrrrgarbl',
  resave: false,
  saveUninitialized: true,
  name: 'itsslackup'
}))

router.get('/', loggedin, (req, res) => {
  res.render('index', { title: 'Slack - IT Services - Simon Fraser University', email: `${req.session.auth.user}@sfu.ca` })
})

router.post('/invite', loggedin, json(), (req, res) => {
  const {org, token} = config
  const email = req.body.email

  if (!email) {
    return res.status(400).json({ msg: 'No email provided' })
  }

  invite({ token, org, email, channel: null }, err => {
    if (err) {
      if (err.redirectUrl) {
        return res.status(303).json({ msg: err.message, redirectUrl: `https://${org}.slack.com` })
      }

      return res.status(400).json({ msg: err.message })
    }

    res.status(200).json({ msg: 'success' })
  })
})

router.get('/login', casauth, (req, res) => {
  res.redirect('./')
})

router.get('/isup', (req, res) => {
  res.send('ok')
})

module.exports = router
