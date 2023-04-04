require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const PORT = process.env.PORT || 3000;
const herokuVar = process.env.HEROKU_NAME || "local Barry"
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("Shoehorn").collection("Shoe");
    const result = await collection.find().toArray();
    console.log(result);
    console.log("cxnDB result: ", result);
    return result; 
  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }
}


app.get('/', async (req, res) => {

  res.redirect('/login')
})

app.get('/mongo', async (req, res) => {

  let result = await cxnDB().catch(console.error); 

  console.log('in get to slash mongo', result[1].drink_name); 

  res.send(`here ya go, joe. ${ result[1].drink_name }` ); 

})
app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function (req, res, next) {
 /* authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});
*/
res.redirect('/home')
})

app.get('/home', async (req, res) => {

  let result = await cxnDB().catch(console.error); 


  res.render('index', {  drinkData : result })
})

app.post('/addDrink', async (req, res) => {

  try {
    client.connect; 
    console.log("You got here.")
    const collection = client.db("Shoehorn").collection("Shoe");
    console.log("You got here2.")
    await collection.insertOne(req.body);
    console.log("You got here3.")  
    res.redirect('/home');
  }
  catch(e){
    console.log(error)
  }
  finally{
   // client.close()
  }

})


app.post('/deleteDrink/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("Shoehorn").collection("Shoe");
    let result = await collection.findOneAndDelete( { _id: new ObjectId( req.params.id) })
    .then(result => {
      console.log(result); 
      res.redirect('/home');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

app.post('/updateDrink/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("Shoehorn").collection("Shoe");
    let result = await collection.findOneAndUpdate( 
      { _id: new ObjectId( req.params.id)}, {$set:{ "size": "big boy size"}})
    .then(result => {
      console.log(result); 
      res.redirect('/home');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})


console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})
