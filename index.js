const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
const { query } = require('express');
var jwt = require('jsonwebtoken');

require('dotenv').config()

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ja3y1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    await client.connect();
    const volunteerCollection = client.db("leader").collection("volunteers");
    const newVolunteer = client.db("newVolunteer").collection("volunteer");
    const createVolunteers = client.db("createVolunteer").collection("volunteer");
    const addVolunteers = client.db("addVolunteer").collection("volunteer");

    try {
        app.get('/volunteer', async (req, res) => {

            const query = {};
            const cursor = volunteerCollection.find(query);
            const volunteer = await cursor.toArray();
            res.send(volunteer)
        })
        app.get('/checkVolunteer', async (req, res) => {
            const query = {};
            const cursor = createVolunteers.find(query);
            const volunteer = await cursor.toArray();
            res.send(volunteer)
        })

        app.get('/newVolunteer', async (req, res) => {

            const query = {};
            const cursor = newVolunteer.find(query);
            const volunteer = await cursor.toArray();
            res.send(volunteer)
        })
        app.get('/volunteer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const collectedVolunteer = await volunteerCollection.findOne(query);
            res.send(collectedVolunteer)
        })
        // login 
        app.post('/login', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.ACCESS_TOKEN);
            res.send({ token })
        })
        // login 

        app.post('/volunteer', async (req, res) => {
            const volunteerDetail = req.body;
            const createVolunteer = await newVolunteer.insertOne(volunteerDetail);
            res.send(createVolunteer)
        })


        app.post('/volunteerCreate', async (req, res) => {
            const volunteerDetail = req.body;
            const createVolunteer = await createVolunteers.insertOne(volunteerDetail);
            res.send(createVolunteer)
        })


        app.post('/addVolunteer', async (req, res) => {
            const token = req.headers.authorization;
            const [email,accessToken] = token.split(' ')
            console.log(accessToken)
            const addDetail = req.body;
            console.log(addDetail)
            const addedVolunteer = await volunteerCollection.insertOne(addDetail);
            res.send(addedVolunteer)
        })


        app.delete('/checkVolunteer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteVolunteer = await createVolunteers.deleteOne(query);
            res.send(deleteVolunteer)
        })


        app.delete('/newVolunteer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteVolunteer = await newVolunteer.deleteOne(query);
            res.send(deleteVolunteer)
        })
        app.delete('/volunteer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteVolunteer = await volunteerCollection.deleteOne(query);
            res.send(deleteVolunteer)
        })
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})