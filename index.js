const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


//start database
app.get('/', (req, res) => {
    res.send('user management system')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://royprosanta778:passs.gjgqpai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

   const userCollection = client.db('userDB').collection('users');

     //get user data
     app.get('/users', async(req, res)=>{
        const data=await userCollection.find().toArray();
        res.send(data);
     })
     //single user get
     app.get('/users/:id', async(req, res)=>{
        const id= req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await userCollection.findOne(query);
        res.send(result)
     })
//post data
    app.post('/users', async(req, res)=>{
        const query=req.body;
        const result= await userCollection.insertOne(query)
        console.log(query)
        res.send(result);
    })
    //update
    app.put('/users/:id', async(req, res)=>{
        const user= req.body;
        const id= req.params.id;
        console.log(id, user)
        const filter={_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: user.name,
              email: user.email,
              number: user.number,
            },
          };
        const result= await userCollection.updateOne(filter, updateDoc,options);
        res.send(result)
    })
 //delete data
    app.delete('/users/:id' , async(req, res)=>{
        const id= req.params.id;
        //jeta delete korbo
        const query={ _id: new ObjectId(id) }
        const result= await userCollection.deleteOne(query);
        res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})