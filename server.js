let express = require('express');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.xhgrj2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let port = process.env.port || 3000;
let collection;

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db().collection('bike');
        console.log(collection);
    } catch(ex) {
        console.error(ex);
    }
}

app.get('/', function (req,res) {
    res.render('index.html');
});

app.get('/api/bike', (req,res) => {
    getAllBike((err,result)=>{
        if (!err) {
            res.json({statusCode:200, data:result, message:'get all bike successful'});
        }
    });
});

app.post('/api/bike', (req,res)=>{
    let bike = req.body;
    postBike(bike, (err, result) => {
        if (!err) {
            res.json({statusCode:201, data:result, message:'success'});
        }
    });
});

function postBike(bike,callback) {
    collection.insertOne(bike,callback);
}

function getAllBike(callback){
    collection.find({}).toArray(callback);
}

app.listen(port, ()=>{
    console.log('express server started');
    runDBConnection();
});