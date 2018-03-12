var express = require('express')
    var path = require('path')
    var url = require('url')
    var bodyparser = require('body-parser')

    var cookieParser = require('cookie-parser')
    var session = require('express-session')

var app = express()
app.locals.william = 'WR__'
    console.log('APP MY GOD WHAT is the app.locals ? ', app.locals)


var photosRouter = require('./routes/photos')

    // https://www.npmjs.com/package/cookie-parser
    app.use(cookieParser('wr__cscie31-secret'))

    // https://www.npmjs.com/package/express-session
    app.use(session({
		secret: 'wr__another-secret',
		resave: "true",
		saveUninitialized: "true"
}))

    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'pug')

    console.log('path.join(__dirname, "public") ', path.join(__dirname, "public"))
    /*
path.join(__dirname, "public")  /Users/william.reilly/dev/JavaScript/CSCI-E31/07-Week-POST/wr-photo/public
     */
    app.use('/static/', express.static(path.join(__dirname, 'public')))

    app.use('/units', (req, res, next) => {
	    res.send("Hey 02 you're on the /units page, ain'tcha?")
	})


	    app.get('/', (req, res) => {
		    res.end('root route requested requested')
		})

    // https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
    //    app.use(bodyparser.urlencoded({extended: false}))
    /* Very nice.
Now, the request object magically gets a 'body' property.
body:
description_name
:
"this is"
imageurl_name
:
"https://www.google.com/logos/doodles/2018/international-womens-day-2018-4678767631925248.5-s.png"
title_name
:
"one"
     */

    app.use('/photos', photosRouter )

    /*
    app.use('/', (req, res, next) => {
	    // seemingly big ol' catch-all
	    res.send("Hey you're on the / home page.")
	})
    */



    app.use((req, res, next) => {
	    // catch-all, as t'were
	    var err = new Error('Not Found. Not Fun. Something is Up.')
	    err.status = 404
	    next(err)
	    // res.send("We see you.")
	})

module.exports = app
