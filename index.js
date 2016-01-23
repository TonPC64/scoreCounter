var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var graph = require('fbgraph')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test')

var findOrCreate = require('mongoose-findorcreate')
var ClickSchema = new Schema({ name: String })
ClickSchema.plugin(findOrCreate)
var User = mongoose.model('User', ClickSchema)

var facebookStrategy = new FacebookStrategy(
  {
    clientID: '1091602634192298',
    clientSecret: '238793b9c7988a5a99bff89dbc747662',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
  },
  function (accessToken, refreshToken, profile, done) {
    graph.setAccessToken(accessToken)
    User.findOrCreate({'id': profile.id}, function (err, user) {
      if (err) { return done(err) }
      done(null, user)
    })
    app.get('/profile', function (req, res) {
      res.send(profile)
    })
  }
)

app.use(passport.initialize())
app.use(express.static('public'))
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})
passport.use(facebookStrategy)

app.post('/post', jsonParser, function (req, res) {
  var searchOptions = {
    q: req.body.message,
    type: 'user',
    fields: 'id,name,picture'
  }
  graph.search(searchOptions, function (err, resdata) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(resdata.data)
    }
  })
})

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'publish_actions' }))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
  failureRedirect: '/login' }))

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
