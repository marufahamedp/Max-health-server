const express = require('express');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Max-Health-Services");
        const helthServicesCollection = database.collection("healthServices");
        const blogCollection = database.collection('blogs');

        //get api
        app.get('/healthServices', async(req, res) =>{
            const cursor = helthServicesCollection.find({});
            const healthService = await cursor.toArray();
            res.send(healthService);
        })
        //get api
        app.get('/blogs', async(req, res) =>{
            const cursor = blogCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog);
        })

        // get single healthServices

        app.get('/healthServices/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const healthService = await helthServicesCollection.findOne(query);
            res.json(healthService);
        })

        // get single Blogs

        app.get('/blogs/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const blog = await blogCollection.findOne(query);
            res.json(blog);
        })

        

        // add Blogs api
        app.post('/blogs', async(req, res)=>{
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.json(result);
        })





        // delete single Blogs

        app.delete('/blogs/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const blog = await blogCollection.deleteOne(query);
            res.json(blog);
        })
        // delete single healthServices

        app.delete('/healthServices/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectID(id) };
            const healthService = await helthServicesCollection.deleteOne(query);
            res.json(healthService);
        })

        // post api
        app.post('/healthServices', async (req, res) => {
            const healthService = req.body;
            console.log('hit the post api', healthService);
            const result =await helthServicesCollection.insertOne(healthService);
            console.log(result);
            res.json(result);

        })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tourfaster server');
});
app.listen(port, () => {
    console.log('Running tourfaster server on port', port);
})