const router = require('express').Router();
const utils = require('../utils/task-schema.js');
const newspapers = require('../db.json')
const { body, validationResult} = require('express-validator');
const { check } = require('express-validator');

const jornales= []//array of newspapers (id,website,source)


//---------------------------------------------- FUNCTIONS -----------------------------------------------------
//Define the dunction that push newspapers's (id,website,source) to jornales array
newspapers.forEach(newspaper => {
    //Pushing the titles and the url in the array articles    
    jornales.push({id:newspaper.id, name: newspaper.name, website:newspaper.website})
    });


//---------------------------------------------- ROUTES -------------------------------------------------------

//--- GETS

//Get all newspapers (id,website,source) ---- DONE
router.get('/', (req,res) => {
    //Display the articles
    console.log('request: GET /newspapers')             
    res.status(200).json(jornales)    
});
//Get newspapers (id,website,source) by id ---- DONE
router.get('/:newspapersId', (req,res) => {
    //Display the newspapers
    const newspaperId = req.params.newspapersId;
    console.log('request: GET /newspapers/'+newspaperId+'') 
    const newspaper = newspapers.find(newspaper => newspaper.id === parseInt(newspaperId));
    if(!newspaper) return res.status(404).send("The newspaper with the provided ID does not exist.");
    res.status(200).json(jornales[newspaperId-1])
    
});



//--- POSTES   ---- DONE?

router.post('/',
//---- Validation
//---- Sanitization
check('name').isLength({ min: 5 }).toLowerCase().trim().not().isEmpty().trim().escape(),
check('website').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('address').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('base').isString().withMessage('has to be a url string').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),

(req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send("The name should be at least 3 chars long!");
  }
  const newspaper = {
    id: newspapers.length + 1,
    name: req.body.name,
    website: req.body.website,
    address: req.body.address,
    base: req.body.base    
    };

    newspapers.push(newspaper);
    console.log('request: POST /newspapers {'+req.body.name+','+req.body.website+','+req.body.address+','+req.body.base+'}')
    res.status(200).json(newspaper)
    //res.status(200).send(newspaper);
});

/*
//--- PUTS (MODIFY) ---- DONE
router.put('/:newspapersId',
//---- Validation
//---- Sanitization
check('name').isLength({ min: 5 }).toLowerCase().trim().not().isEmpty().trim().escape(),
check('website').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('address').isURL().withMessage('its not a url').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
check('base').isString().withMessage('has to be a url string').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
(req,res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).send("The name should be at least 3 chars long!");
  }

    const id = parseInt(req.params.id)//get the id from the req
    const newspaper = newspapers.find(newspaper => newspaper.id === id)//find the parking that have the same id as the id the client insert

    newspaper.name = req.body.name,//set the name of the parking to the name that the client insert in the req body
    newspaper.website =req.body.website,//
    newspaper.address =req.body.address,//
    newspaper.base =req.body.base,//

    console.log('request: POST /newspapers/'+id+'{'+req.body.name+','+req.body.website+','+req.body.address+','+req.body.base+'}')
    res.status(200).json(newspaper)
   // res.status(200).send(newspaper);


});
*/

router.put("/:id",(request, response) => {
  const taskId = request.params.id;
  const task = newspapers.find(task => task.id === parseInt(taskId));
  if(!task) return response.status(404).send("The task with the provided ID does not exist.");

  const { error } = utils.validateTask(request.body);
  if(error) return response.status(400).send("The name should be at least 3 chars long!");

  task.name = request.body.name,//set the name of the parking to the name that the client insert in the req body
  task.website = request.body.website,//
  task.address = request.body.address,//
  task.base = request.body.base,//

  response.send(task);
});

//--- DELETE ---- DONE

router.delete("/:newspapersId", (request, response) => {
  const taskId = request.params.id;
  const task = newspapers.find(task => task.id === parseInt(taskId));
  if(!task) return response.status(404).send("The newspaper with the provided ID does not exist.");

  const index = newspapers.indexOf(task);
  newspapers.splice(index, 1);
  response.send(task);
});

module.exports = router;