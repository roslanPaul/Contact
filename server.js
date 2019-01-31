var express    = require("express");
var bodyParser = require("body-parser");
var mongodb    = require("mongodb");

var ObjectID   = mongodb.ObjectID;

var url = "mongodb://ros:contact1@ds261521.mlab.com:61521/contact-ang-db";

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// create a database variable
var db;

// connect to the database 
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function(err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // save database object.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// CONTACTS API ROUTES BELOW

// Generic error handler.
function handleError(response, reason, message, code) {
    console.log("ERROR "+reason);
    response.status(code || 500).json({"error": message});
}

/* "/api/contacts"
*   GET: finds all contacts
*   POST: creates a new contact 
*/

app.get("/api/contacts", function(request, response) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/contacts", function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
        db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
            if (err) {
                handleError(res, "Invalid user input", "Must provide a name", 400);
            } else {
                db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
                    if (err) {
                        handleError(res, err.message, "Failed to create new contact.");
                    } else {
                        res.status(201).json(doc.ops[0]);
                    }
                });
            }
        });
    }
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/contacts/:id", function(request, response) {
});

app.put("/api/contacts/:id", function(request, response) {
});

app.delete("/api/contacts/:id", function(request, response) {
});
