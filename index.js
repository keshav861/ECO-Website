import express from "express";
// import serverless from 'serverless-http';
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url"
import mongoose from "mongoose"
const __dirname = dirname(fileURLToPath(
    import.meta.url));

const app = express();
const port = 5500;

mongoose.connect("mongodb://127.0.0.1:27017/ECO", { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    number: String,
    username: String
});


const Person = mongoose.model("Person", personSchema);

const Server = mongoose.model("Server", serverSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/login", async(req, res) => {
    const person = await Person.findOne({ email: req.body["email"] }).exec();
    const server = await Server.findOne({ email: req.body["email"] }).exec();

    if (person) {
        if (req.body["password"] == person.password)
            res.sendFile(__dirname + "/client_interface/index2.html");
        else
            res.sendFile(__dirname + "/pages/login.html");
    } else if (server) {
        if (req.body["password"] == server.password)
            res.sendFile(__dirname + "/user_interface/index2.html");
        else
            res.sendFile(__dirname + "/pages/login.html");
    } else
        res.sendFile(__dirname + "/pages/signup.html");
})

app.post("/signup", async(req, res) => {
    const existing = await Person.findOne({ number: req.body["number"] }).exec();
    if (existing) {
        res.send("User Exists");
    } else {
        Person.create({
            name: req.body["name"],
            password: req.body["password"],
            email: req.body["email"],
            username: req.body["username"],
            number: req.body["number"]
        }).then((data) => {});
        if (req.body["password"] == req.body["conf_password"]) {
            res.sendFile(__dirname + "/client_interface/index2.html");
        }
    }
})

app.post("/server", async(req, res) => {
    const existing = await Server.findOne({ brnumber: req.body["brnumber"] }).exec();
    if (existing) {
        res.send("Service Provider Exists");
    } else {
        Server.create({
            name: req.body["name"],
            password: req.body["password"],
            email: req.body["email"],
            username: req.body["username"],
            brnumber: req.body["brnumber"]
        }).then((data) => {});
        if (req.body["password"] == req.body["conf_password"]) {
            res.sendFile(__dirname + "/user_interface/index2.html");
        }
    }
})

app.listen(port, () => {
    console.log(`${port}`);
})