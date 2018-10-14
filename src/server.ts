import * as express from "express";
// import * as graphqlHTTP from "express-graphql";
// import {MongoClient} from "mongodb";
import {buildSchema} from "graphql";
import * as fs from "fs";
import * as path from "path";
// import {DiffContext, DiffResolver} from "./model/DiffResolver";
// import {Db} from "indexed-mongo/dist/Db";
// require('dotenv').config();
//
// const program = require('commander');
//
// program
//     .option('-p, --projectId <id>', 'Project id')
//     .option('-c, --comparedMov <mov>', 'Compared video id')
//     .parse(process.argv);
//
// const {projectId, comparedMov} = program;
// const defs = fs.readFileSync("schema.graphqls", "utf-8");
// const schema = buildSchema(defs);
// const context: DiffContext = {};
const app = express();
// // Connection url
// const url = 'mongodb://localhost:27017';
// // Connect using MongoClient
// MongoClient.connect(url, function (err, client) {
//     if (err) throw err;
//     context.db = client.db(projectId) as any;
// });
const root = path.resolve(__dirname, "./dist");
console.log(root);
app.use(express.static(root));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
// app.get('/', function (req, res) {
//     res.send('root')
// });
// app.get("/*", (req, res) => {
//
//     res.writeHead(200, {"Content-Type" : "text/html"});
//     res.end();
// });

// app.use('/graphql', graphqlHTTP({
//     schema : schema,
//     context : context,
//     rootValue : DiffResolver,
//     graphiql : true,
// }));
