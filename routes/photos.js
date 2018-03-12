/* CSCI-E31 Week 07
https://canvas.harvard.edu/courses/35096/pages/week-7-multer-filters-and-error-handling?module_item_id=365095
et environs ...

March 10, 2018
MULTER
https://github.com/expressjs/multer#filefilter etc.
 */

var express = require('express');
var photosRouter = express.Router();

var flash = require('connect-flash')

    photosRouter.use(flash())

var { 
    myFileFilter, 
	myRefactoredDiskStorage,
	putManyUploadedPhotosInOurMemoryArray,
	myHumbleForLoopFunction
	} = require('../controllers/photoController.js');


var 	putManyUploadedPhotosInOurMemoryArrayHereAssigned = 	putManyUploadedPhotosInOurMemoryArray; // y not

var myFileFilterHereAssigned = myFileFilter // y not
    //    console.log('wthay is myFileFilterHere anyhoo? ', myFileFilterHere) // { myFileFilter: [Function: myFileFilter]}
    console.log('wthay is myFileFilterHereAssigned anyhoo? ', myFileFilterHereAssigned) // 
    console.log('wthay is myFileFilter anyhoo? ', myFileFilter) //
    /* IT IS THE WHOLE FUNCTION. BON.
function myFileFilter(req, file, cb) {
console.log('CONTROLLER photoController.js myFileFilter. file: ', file)
if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // we've omitted gif o well
            // return cb(new Error('oops only jpg jpeg png kids'), false)
	        return cb(new Error('myErrorCodeOnlyImageFiles'), false)
		} else {
		    cb(null, true)
		    }
    }
     */


    // We need the 'app', but you get it by (re)-running "express()". To me, kinda weird o well.
    //    var app = require('../app') // NO
    var app = express() // YES. "It returns the same object" (as when we ran exact same line over in app.js)
app.locals.william2 = 'WR__2'
    console.log('ROUTER MY GOD WHAT is the app.locals 2 ? ', app.locals)



    var multer = require('multer')

    var uploadImg = multer({ dest: 'public/img' })

    var myStorageHere = multer.diskStorage(myRefactoredDiskStorage)

    /* REFACTORED OUT TO /controllers/photoController.js 

    var myStorage = multer.diskStorage({
	    destination: function(req, file, cb) {
		console.log('multer diskStorage "destination" file is: ', file)
		/ *
multer diskStorage "destination" file is:  æ fieldname: 'image_name',
  originalname: 'Photo 3.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg' å
		 * /
		if(file.mimetype === 'image/jpeg') {
		    cb(null, 'public/img')
		} else if (file.mimetype === 'image/png') {
		    cb(null, 'public/img-png')  // YES. worked. :)
		} else {
		    console.log('WADDAYU TRYIN\' TA DO TA ME EH?!') // Also worked. :)
		}

	    },
	    filename: function(req, file, cb) {
		console.log('multer diskStorage "filename" file is: ', file)
		cb(null, file.fieldname + '-' + Date.now())
	    }
	})
*/





    // WORKS:    var uploadDiskStorage = multer({ storage: myStorage })
    var uploadDiskStorage = multer({ 
	    storage: myStorageHere,
	    fileFilter: myFileFilterHereAssigned
	    //	    fileFilter: myFileFilter
	    //	    fileFilter: myFileFilterHere
	})

    if(!app.locals.photolist) {
	app.locals.photolist = [] // init, if don't exist already
    }
    console.log('ROUTER MY GOD WHAT is the app.locals.photolist ? ', app.locals.photolist)


/* REFACTORED OUT TO /controllers/photoController.js

    function myFileFilter (req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // we've omitted gif o well
            // return cb(new Error('oops only jpg jpeg png kids'), false)
	    return cb(new Error('myErrorCodeOnlyImageFiles'), false)
		} else {
	    cb(null, true)
	}
    }
*/
    // Here in routes/photos, '/' === '/photos' on URL
    photosRouter.get('/', (req, res, next) => {

    console.log('ROUTER GET-GET-GET MY GOD WHAT is the app.locals.photolist ? ', app.locals.photolist)


    // req.flash.wr__fileUploadError is available here, if there was an Error ...

    // No. It isn't a property "on" req.flash.  see below
    //    console.log('whoa 9999 req.flash.wr__fileUploadError ', req.flash.wr__fileUploadError) // undefined (so far) hmmph.

    // You have to "call" it using req.flash:
    // Babykins. Menushka. Do not, under EENY circumstance, use da frickin' CONSOLE.LOG(). Don't! Do! It!
    // O la.
    //    console.log('whoa 8888 req.flash.wr__fileUploadError ', req.flash('wr__fileUploadError'))

    // Same G.D. story here. Skip it! Let it alone!
    //    var one_message_from_array_nonsense = req.flash('wr__fileUploadError')

    res.render('photos', { photos: app.locals.photolist,
			   // Just wrong. (syntax)			   flash_message: req.flash.wr__fileUploadError })
			   // syntax lovely let's give it (another) go hey?
			   flash_message: req.flash('wr__fileUploadError') })
    // No. You're in the wrong.  flash_message: one_message_from_array_nonsense[0] })
 // gonna be actual data from the form, stored in memory. cheers.

		    /* ORIG approach: some hard-coded stuff:
[
			{title: "First pic", description: "words 1"},
			{title: "Second pic", description: "words 2"},
			{title: "Third pic", description: "words 3"}
			]
		    */

		//	    res.send('we are in / for /photos')
	    console.log('wr__ placeholder? hey')
	})

    //	photosRouter.post('/', uploadImg.single('image_name'), (req, res, next) => {
    // .SINGLE() yields req.file
    //	photosRouter.post('/', uploadDiskStorage.single('image_name'), (req, res, next) => {
    // .ANY() yields req.files []
    // .ARRAY() yields req.files [], aussi (je crois)
	photosRouter.post('/', uploadDiskStorage.array('image_name'), (req, res, next) => {

		var ofHowMany = req.files.length // e.g. Array of 3 gets 3. We below say "image 1 of 3", "image 2 of 3" etc.

		// ******* NEW
		var oneTitleForAllInArray = req.body.title_name
		var oneDescForAllInArray = req.body.description_name

		/* Learnin' the Hard Way (I guess)
The "app" I make, from express(), over in /controllers/photoController.js,
is NOT the same object as the "app" I make, from express(), in 1) /app.js, nor 2) /routes/photos.js
No sir.
Each is its own G.D. object.
- In /app.js, I use it to configure the "app" with views engine and other good stuff.
- In /routes/photos.js I use it ("app") just to hold a ".locals" photolist.
- And in /controllers/photoController.js, I use the "app" to similarly hold the ".locals" photolist while I build it up, spinning through my array-driven for loop. 
-- But as you'll notice, the resultant list is RETURNED to /routes/photos.js, where is it assigned to the "app" ".locals" photolist OVER IN THAT MODULE.  It is NOT a reference to the "same object." No sir.
		 */
		app.locals.photolist = myHumbleForLoopFunction(oneTitleForAllInArray, oneDescForAllInArray, req, app)

		// ******  /NEW


/*
This bad boy stumbled on not having access to the REQ . Hmm.
 */
		//		req.files.forEach(putManyUploadedPhotosInOurMemoryArrayHereAssigned)

		//		req.files.forEach(putManyUploadedPhotosInOurMemoryArray)
		// https://www.w3schools.com/jsref/jsref_forEach.asp


		// REFACTORED OUT. NO LONGER USING. SEE  putManyUploadedPhotosInOurMemoryArrayHereAssigned instead
		function putManyUploadedPhotosInOurMemoryArray(onePhoto, crazyIndex) { 

		    

		    // console.log('wtf. req.file.fieldname is ', req.files[0].fieldname) // YES. image_name
		console.log('wtf. Here in ARRAY FOREACH:  onePhoto.fieldname is ', onePhoto.fieldname) 
		// console.log('wtf. req.file.filename is ', req.files[0].filename) // YES. 0d727f09221eefc2988f8859ad6a82f5
		console.log('wtf. Here in ARRAY FOREACH:  onePhoto.filename is ', onePhoto.filename) 
		console.log('wtf. Here in ARRAY FOREACH:  OBTW that crazyIndex? It is ', crazyIndex) 

		//- NOPE:		console.log('wtf. image_name is ', image_name)
		/*
ReferenceError: image_name is not defined
		 */

	    console.log('POST / is /photos')
	    /*
	      Form data is available via the request object, but it is not simply a property.
	      Instead, it is available as a Stream, a Readable Stream, on the IncomingMessage (request).
	      Coming from an HTML Form, we know it will be a series of Strings...
	     */
	    var formdata = ''
	    /*
NEWS FLASH. Now that we are using body-parser, I take it that is INTERCEPTING the whole "on('data')" thing, kids.
	     */

		var imageurlDir = "/static/img/"
		//		if (req.files[0].mimetype === 'image/png') {
		// We are now in a FOREACH
		if (onePhoto.mimetype === 'image/png') {
		    imageurlDir = "/static/img-png/"
		}



		var photoFromForm = {title: req.body.title_name + " - Image " + (crazyIndex + 1) + " of " + ofHowMany,
			description: req.body.description_name,
			// imageurl: req.body.imageurl_name,
			// https://github.com/expressjs/multer#singlefieldname
			// imageurl: "/static/img/" + req.file.filename}
			imageurl: imageurlDir + onePhoto.filename}
		    console.log('wtf. photoFromForm be: ', photoFromForm)
		    app.locals.photolist.push(photoFromForm)

	    console.log('*******')
	    console.log('app.locals.photolist: ', app.locals.photolist)
	    /*
       *******
app.locals.photolist:  Æ æ title: '88',
    description: '23',
    imageurl: '/static/img/c8b939abb0d82d0bdfff1e66b03b3987' å,
  æ title: 'another',
    description: 'one bites the dust',
    imageurl: '/static/img/60f27d39842e8b75c78d7d6231bf0b32' å Å
    *******
	     */
	    console.log('*******')

		} // THIS MUST BE END OF : putManyUploadedPhotosInOurMemoryArray(){}


    console.log('ROUTER 987 MY GOD WHAT is the app.locals.photolist ? ', app.locals.photolist)
		    res.redirect('/photos') // gotta send something back to browser...

		// OUR WORK HERE IS *D-U-N* (je crois)


	    req.on('data', (whatIGot) => {
		    console.log('whatIGot[0] is ', whatIGot[0])
		    // whatIGot[0] is  116


		    console.log('whatIGot[0].toString(10) is ', whatIGot[0].toString(10)) // 116 (boring)
		    console.log('String.fromCharCode(whatIGot[0]) is ', String.fromCharCode(whatIGot[0])) // t (v. nice!)

		    var allThoseChars = whatIGot
		    .map((eachBufferNumber) => { 
			    //			    console.log('eachBufferNumber is: ', eachBufferNumber) // Yes. e.g. 110 etc.
			    let isThisACharNow = String.fromCharCode(eachBufferNumber)
			    // console.log('isThisACharNow ? ', isThisACharNow) // Yes! e.g. t etc. :o)
			    return isThisACharNow
})
		    console.log('allThoseChars be: ', allThoseChars)
		    /* Don't work! Buffer ain't array, friend.
allThoseChars be:  Buffer(164) [0, 0, 0, 0, ... ]
		     */

		    console.log('whatIGot is ', whatIGot)
		    /*
whatIGot is  Buffer(164) [116, 105, 116, 108, 101, 95, 110, 97, 109, 101, 61, 111, 110, 101, 38, 100, 101, 115, 99, 114, 105, 112, 116, 105, 111, 110, 95, 110, 97, 109, 101, 61, 116, 104, 105, 115, 43, 105, 115, 38, 105, 109, 97, 103, 101, 117, 114, 108, 95, 110, 97, 109, 101, 61, 104, 116, 116, 112, 115, 37, 51, 65, 37, 50, 70, 37, 50, 70, 119, 119, 119, 46, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109, 37, 50, 70, 108, 111, 103, 111, 115, 37, 50, 70, 100, 111, 111, 100, 108, 101, 115, …]
		     */
		    //		    console.log('whatIGot[0].toString(\'utf8\')  is ', whatIGot[0].toString('utf8'))
		    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Bad_radix
		    console.log('whatIGot.toString(\'utf8\')  is ', whatIGot.toString('utf8'))
		    /*
whatIGot.toString('utf8')  is  title_name=one&description_name=this+is&imageurl_name=https%3A%2F%2Fwww.google.com%2Flogos%2Fdoodles%2F2018%2Finternational-womens-day-2018-4678767631925248.5-s.png
		     */
		    formdata += whatIGot
		    console.log('ON DATA. formdata is: ', formdata)
		}) // END OF REQ.ON('DATA') ...


	    req.on('end', (nomo) => {
		    //		    console.log('end. nomo is: ', nomo)
		    console.log('ON END. formdata is: ', formdata)
		    /*
POST / is /photos
end. nomo is:  undefined
end. formdata is:  title_name=one&description_name=this+is&imageurl_name=https%3A%2F%2Fwww.google.com%2Flogos%2Fdoodles%2F2018%2Finternational-womens-day-2018-4678767631925248.5-s.png
		     */

    /* Very nice. Compare above formdata string, to this nice little object req.body:. Yay.
Now, WITH THE AID OF BODY-PARSER, YAH? - the request object magically gets a 'body' property.
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

		}) // END OF REQ.ON('END') ...
	    
	    }) // THIS MUST BE THE END of my crazy POST '/'. BUT NOTE THAT WE DO RES.REDIRECT('/photos') WAY UP ABOVE, EFFECTIVELY ENDING THIS BIG OL' WHATEVER. "OUR WORK HERE IS *D-U-N*". OH YEAH.



    // ERROR HANDLING !
	photosRouter.use(function(err, req, res, next) {
		if(err) {
		    // Do something wonderful. ~08:14 Video 7.32
		    
		}
		// Hmm, actually, from Instructor code, looks like to get here you WILL have err. Okay. No need for "if()" above. Okay.
		console.error(err.stack) // very fun
		    if (err.message = "myErrorCodeOnlyImageFiles") {
			// Worked. But now improved. ("flash")
			// res.send("Hey good people, pls only upload jpg jpeg or png. Gracias. The Management.")

			req.flash('wr__fileUploadError', 'Hey good flashy people, just pics. Thx.')
			    res.redirect('/photos')

			    } else {
			next(err) // wasn't my special code; just pass this damned err along. cheers.
		    }
	    })

    /* WOW. WEIRD. 
This (base64 stuff as "URL") works as an 'imageurl'. BIZZARRO.

This, my friends, is a CHEESEBURGER:

From this "Google Images" page:
https://www.google.com/search?biw=1140&bih=563&tbm=isch&sa=1&ei=hX2hWseENom9zgKNw63oCA&q=cheeseburger&oq=cheese&gs_l=psy-ab.3.3.0l10.48407.49287.0.51671.6.6.0.0.0.0.83.425.6.6.0....0...1c.1.64.psy-ab..0.6.425...0i67k1.0.W0MFOlarP7s

Right-click, "Copy image address"

Here is where it really came from:
https://en.wikipedia.org/wiki/Cheeseburger#/media/File:Cheeseburger.jpg

But HERE is the CHEESEBURGER:

data:image/jpeg;base64,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


     */

module.exports = photosRouter