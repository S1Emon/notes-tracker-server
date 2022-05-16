const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

//middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekphi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const notesCollection = client.db('notes').collection('notesTracker')

        //To Read or Get all data from mongodb
        app.get('/notes', async (req, res) => {
            const query = req.query
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })

        //To Create data in mongodb
        app.post('/note', async (req, res) => {
            const data = req.body
            const result = await notesCollection.insertOne(data)
            res.send(result);
        })


        //To Update a data in mongodb
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    ...data
                }
            }
            const result = await notesCollection.updateOne(filter, option, updateDoc);
            res.send(result)
        })

        //Delete a data from mongodb
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        })

    }
    finally {

    }
    console.log('Connected to Tracker Database');
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Server is running');
})