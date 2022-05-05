// CSCI2720 Assignment 3
// Name: Cheng Wing Lam
// SID: 1155125313

// event_form.html is used to POST event
// loc_form.html is used to POST location
// update_event.html is used to PUT event detail 

const express = require('express');
const app = express();
const cors = require('cors');
const methodOverride = require("method-override");
var mongoose = require('mongoose');

// mongoose.connect('server URL');
mongoose.connect('mongodb+srv://stu039:p950141-@csci2720.6hfif.mongodb.net/stu039');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
const EventSchema = new mongoose.Schema({
    eventId: {
        type: Number, required: true,
        unique: true
    },
    name: { type: String, required: true },
    loc: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },

    quota: { type: Number }
});

const LocSchema = new mongoose.Schema({
    locId: {
        type: Number, required: true,
        unique: true
    },
    name: { type: String, required: true },
    quota: { type: Number }
});

const Event = mongoose.model('Event', EventSchema);
const Location = mongoose.model('Location', LocSchema);


const bodyParser = require('body-parser');
const { json, send } = require('express/lib/response');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"))

var count = 0;
var compare_count = count;

db.once('open', function () {

    //Q1
    app.get('/event/:eventId', (req, res) => {
        count++;
        var query = Event.findOne({ eventId: req.params['eventId'] });
        query.select('-_id eventId name loc quota').populate('loc', '-_id locId name');
        query.exec().then(results => {
            if (results == null) {
                res.contentType('text/plain')
                res.status(404).send("This event is not existed.\n404 Not Found\n");
            }
            else {
                res.contentType('text/plain')
                //console.log(results)
                // res.send(
                //     "{\n\"eventId\": " + results.eventId +
                //     ",\n\"name\": \"" + results.name +
                //     "\",\n\"loc\":\n{\n\"locId\": " + results.loc.locId +
                //     ",\n\"name\":\"" + results.loc.name +
                //     "\"\n}," +
                //     "\n\"quota\": " + results.quota +
                //     "\n}")
                var event = JSON.stringify(results, null, "\t")
                res.send(event)
            }
        }, error => {
            res.contentType('text/plain')
            res.send(error)
        })

    });

    //Q2
    app.post('/event', (req, res) => {
        Event.find().sort({ eventId: -1 }).select({ eventId: 1 }).exec().then(results => {
            var eid
            if (results.length < 1)
                eid = 1
            else
                eid = results[0].eventId + 1
            return eid
        }, error => {
            res.contentType('text/plain')
            res.send(error)
        }).then((eid)=> {
            //console.log(eid)
            Location.findOne({ locId: req.body['loc'] }).select('_id quota').exec().then(locat => {
                if (locat.quota < req.body['quota']) {
                    res.send("Location's quota is smaller than event's quota. This event is not created.")
                } else {
                    Event.create({
                        eventId: eid,
                        name: req.body['name'],
                        loc: locat._id,
                        quota: req.body['quota']
                    }).then(function () {
                        res.setHeader('Location', ' http://server address/event/' + eid);
                        var query = Event.findOne({ eventId: eid });
                        query.select('-_id eventId name loc quota').populate('loc', '-_id locId name');
                        query.exec().then(item => {
                            if (item == null) {
                                res.contentType('text/plain')
                                res.status(404).send("This event is not existed.\n404 Not Found\n");
                            }
                            else {
                                res.contentType('text/plain')
                                var event = JSON.stringify(item, null, "\t")
                                res.status(201).send(event)
                                //res.status(201).send(event.replace(/\t/g, ""))
                                //console.log(results)
                                // res.status(201).send("{\n\"eventId\": " + item.eventId +
                                // ",\n\"name\": \"" + item.name +
                                // "\",\n\"loc\":\n{\n\"locId\": " + item.loc.locId +
                                // ",\n\"name\":\"" + item.loc.name +
                                // "\"\n}," +
                                // "\n\"quota\": " + item.quota +
                                // "\n}")

                            }
                        }, Error => {
                            res.contentType('text/plain')
                            res.send(Error)
                        })
                    }, e => {
                        res.contentType('text/plain')
                        res.send(e)
                    })
                };
            }, err => {
                res.contentType('text/plain')
                res.send(err)
            })
        })
    });

    app.post('/loc', (req, res) => {
        Location.create({
            locId: req.body['locId'],
            name: req.body['name'],
            quota: req.body['quota']
        }).then(results => {
            res.status(201).send("Ref: " + results);
        }, err => {
            res.contentType('text/plain')
            res.send(err);
        })
    });

    //Q3
    app.delete('/event/:eventId', (req, res) => {
        var query = Event.findOne({ eventId: req.params['eventId'] });
        query.populate('loc', '-_id locId name');
        query.exec().then(results => {
            if (results == null) {
                res.contentType('text/plain')
                res.status(404).send("This event is not existed.\n404 Not Found\n");
            } else {
                Event.deleteOne({ _id: results._id },).then(function () {
                    res.status(204).send("204 No Content")
                }, error => {
                    res.contentType('text/plain')
                    res.send(error);
                })
            }
        }, err => {
            res.contentType('text/plain')
            res.send(err);
        })

    })

    //Q4
    app.get('/event', (req, res) => {
        count++;
        var query = Event.find();
        query.select('-_id eventId name loc quota').populate('loc', '-_id locId name');
        query.exec().then(results => {
            if (results == null) {
                //res.type('text/plain')
                res.send("There is no event.");
            } else {
                res.contentType('text/plain')
                // var allevent = "[\n";
                // results.forEach(element => {
                //     allevent += "{\n\"eventId\": " + element.eventId +
                //         ",\n\"name\": \"" + element.name +
                //         "\",\n\"loc\":\n{\n\"locId\": " + element.loc.locId +
                //         ",\n\"name\":\"" + element.loc.name +
                //         "\"\n}," +
                //         "\n\"quota\": " + element.quota +
                //         "\n}\n,\n"
                // }); 

                // allevent = allevent.slice(0, -2)
                // allevent += "]"
                // res.send(allevent)
                var event = JSON.stringify(results, null, "\t")
                // event = event.replace(/\t/g,"")
                res.send(event)
                //console.log(results)
            }
        }, err => {
            res.contentType('text/plain')
            res.send(err);
        })

    });

    //Q5
    app.get('/loc/:locId', (req, res) => {
        count++;
        var query = Location.findOne({ locId: req.params['locId'] });
        query.select('-_id locId name quota');
        query.exec().then(results => {
            if (results == null) {
                res.contentType('text/plain')
                res.status(404).send("This location is not existed.\n404 Not Found\n");
            }
            else {
                res.contentType('text/plain')
                // res.send(
                //     "{\n\"locId\": " + results.locId +
                //     "\n\"name\": \"" + results.name +
                //     "\"\n\"quota\": " + results.quota +
                //     "\"\n}")
                var event = JSON.stringify(results, null, "\t")
                res.send(event)
            }
        }, error => {
            res.contentType('text/plain')
            res.send(error)
        })
    });

    //Q6 & Q7
    app.get('/loc', (req, res) => {
        count++;
        if (Object.keys(req.query).length === 0)
            var query = Location.find();
        else
            var query = Location.find({ quota: { $gte: req.query['quota'] } })
        query.select('-_id locId name quota');
        query.exec().then(results => {
            if (results == null)
                res.send("There is no location available");
            else {
                res.contentType('text/plain')
                // var allloc = "[\n";
                // results.forEach(element => {
                //     allloc +=
                //         "{\n\"locId\": " + element.locId +
                //         "\n\"name\": \"" + element.name +
                //         "\"\n\"quota\": " + element.quota +
                //         "\"\n}\n,\n"
                // });
                // allloc = allloc.slice(0, -2)
                // allloc += "]"
                // if (results.length == 0) {
                //     allloc = "[ ]"
                // }
                // res.send(allloc)
                //console.log(results)
                var event = JSON.stringify(results, null, "\t")
                res.send(event)
            }
        }, error => {
            res.contentType('text/plain')
            res.send(error)
        })
    });

    //Q8
    app.put('/event/:eventId', (req, res) => {
        var query = Location.findOne({ locId: req.body['loc'] }).select('_id quota locId name')
        query.exec().then(locat => {
            if (locat == null) {
                res.contentType('text/plain')
                res.status(404).send("This location is not existed.\n404 Not Found\n");
            }
            else {
                Event.findOneAndUpdate({ eventId: req.body['eid'] }, {
                    name: req.body['name'],
                    loc: locat._id,
                    quota: req.body['quota']
                }).exec().then(re => {
                    if (re == null) {
                        res.contentType('text/plain')
                        res.status(404).send("This event is not existed.\n404 Not Found\n");
                    } else {
                        res.contentType('text/plain')
                        // res.send("{\n\"eventId\": " + req.body['eventId'] +
                        //     ",\n\"name\": \"" + req.body['name'] +
                        //     "\",\n\"loc\":\n{\n\"locId\": " + locat.locId +
                        //     ",\n\"name\":\"" + locat.name +
                        //     "\"\n}," +
                        //     "\n\"quota\": " + req.body['quota'] +
                        //     "\"\n}")
                        var results = {
                            eventId: Number(req.body['eid']),
                            name: req.body['name'],
                            loc: { locId: locat.locId, name: locat.name },
                            quota: Number(req.body['quota'])
                        }
                        var event = JSON.stringify(results, null, "\t")
                        res.send(event)
                    }
                }, err => {
                    res.contentType('text/plain')
                    res.send(err)
                })
            }
        }, error => {
            res.contentType('text/plain')
            res.send(error)
        })
    })

    // handle ALL requests
    app.all('/*', (req, res) => {
        // send this to client
        res.send("CSCI 2720 Assignment 3<br>\nName: Cheng Wing Lam<br>\nSID: 1155125313");
    });
})

// listen to port 3000
const server = app.listen(3000);

setInterval(function () {
    if (compare_count == count) {
        count = 0
        compare_count = 0
    }
    else
        compare_count = count
}, 300000)

// npm install body-parser

function updateevent(form) {
    var eid = document.querySelector("#eventid").value
    var name = document.querySelector("#neweventname").value
    var locat = document.querySelector("#neweventloc").value
    var quota = document.querySelector("#neweventquota").value
    if (eid.length < 1) {
        document.querySelector("#eventId").classList.add("is-invalid")
    }
    else if (name.length<1||locat.length<1||quota.length<1) {
        alert("Some information is missing")
    }
    else {
        var link = "http://localhost:3000/event/" + eid
        form.action = link + "?_method=PUT"
    }
}


function loadevent() {
    //console.log("get in")
    var eid = document.querySelector("#eventid").value
    if (eid.length < 1) {
        alert("Event ID can't be empty")
    }
    else {
        var link = 'http://localhost:3000/event/' + eid
        fetch(link)
            .then(response => response.text())
            .then(data => {
                //console.log(data)
                var eventdetail = data.replace(/\n/g, "")
                var e = JSON.parse(eventdetail)
                //console.log(e.name, e.eventId)
                document.querySelector("#neweventname").value = e.name
                document.querySelector("#neweventloc").value = e.loc.locId
                document.querySelector("#neweventquota").value = e.quota

            }).catch(error => {
                alert("This event is not existed. Please enter the correct event ID", error)
            });
        // console.log("finish in")
    }

}
