
/*
REFACTOR out from /routes/photos.js: photosRouter object

We'll put here instead the logic for:
- file filter uploads FUNCTION
- multer disk storage PLAIN OLD OBJECT
- utility function to run array of files, upload 'em << Stumbled on not having the REQ
- TAKE TWO: myHumbleForLoopFunction << Okay (I hope), but does need the APP here. cheers
 */

// YES. WORKED:  HEY - We'll just PASS the APP IN (on the Humble() biz)
 var express = require('express')
    var apphere = express()
    console.log('CONTROLLER MY GOD WHAT is the app apphere that is? ', apphere)

     // copied from /routes/photos.js
    if(!apphere.locals.photolist) {
	apphere.locals.photolist = [] // init, if don't exist already
    }
    console.log('CONTROLLER MY GOD WHAT is the apphere.locals.photolist ? ', apphere.locals.photolist)

    function myFileFilter (req, file, cb) {
	console.log('CONTROLLER photoController.js myFileFilter. file: ', file)
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // we've omitted gif o well
            // return cb(new Error('oops only jpg jpeg png kids'), false)
	    return cb(new Error('myErrorCodeOnlyImageFiles'), false)
		} else {
	    cb(null, true)
	}
    }



    var myRefactoredDiskStorage = {
	    destination: function(req, file, cb) {
		console.log('WHOA. CONTROLLER. multer diskStorage "destination" file is: ', file)
		/*
multer diskStorage "destination" file is:  æ fieldname: 'image_name',
  originalname: 'Photo 3.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg' å
		 */
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
	}



	function myHumbleForLoopFunction(thatTitle, thatDesc, req, app) {

	    console.log('CONTROLLER. app-created vs. ? app-passed-in ', apphere === app) // false of course hmm.
	    console.log('CONTROLLER. app-created here ', apphere) // function (req, res, next) {		app.handle(req, res, next); }

	    console.log('CONTROLLER. app-passed-in ',  app) // lo stesso.


	    var imageurlDir = "/static/img/";
	    
	    for ( i = 0; i < req.files.length; i++) {

		if (req.files[i].mimetype === 'image/png') {
		    imageurlDir = "/static/img-png/"
		}

		var stickOnPhotoList = {
		    title: thatTitle,
		    description: thatDesc,
		    imageurl: imageurlDir + req.files[i].filename
		}

		apphere.locals.photolist.push(stickOnPhotoList)

	    console.log('**** REFACTORED humble for loop ***')
	    console.log('apphere.locals.photolist: ', apphere.locals.photolist)
	    console.log('*******')
	    }

	    return apphere.locals.photolist;

	}


/*
This bad boy stumbled on not having access to the REQ . Hmm.
 */
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



module.exports.myRefactoredDiskStorage = myRefactoredDiskStorage
module.exports.myFileFilter = myFileFilter
module.exports.putManyUploadedPhotosInOurMemoryArray = putManyUploadedPhotosInOurMemoryArray
module.exports.myHumbleForLoopFunction = myHumbleForLoopFunction
