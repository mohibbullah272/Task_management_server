const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
const port = process.env.PORT || 5500
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://task_management:O8UG634vCDuFke6B@cluster0.3t5vk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const taskCollection =client.db("task-Manage").collection('user-task')
    app.post('/tasks', async (req, res) => {
      const { email, title, description, status } = req.body;
  
     
  
      const newTask = {
          email,
          title,
          description: description || '',
          status,
          timestamp: new Date()
      };
  
      const result = await taskCollection.insertOne(newTask);
      res.json(result);
  });
  app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || title.length > 50 || (description && description.length > 200)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, description, status } }
    );

    res.json(result);
});
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;

  const result = await taskCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTask }
  );

  res.send(result);
});


    app.get('/tasks',async(req,res)=>{
        const email = req.query.email 
        const query = {email:email}
        const result = await taskCollection.find(query).toArray()
        res.send(result)
    })

    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('task management system running now')
})

app.listen(port ,()=>{
    console.log(`server running on ${port}`)
})