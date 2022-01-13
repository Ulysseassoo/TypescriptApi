import express from "express"
import RandomUser from "./Services/randomuser"
import "reflect-metadata"
import { createConnection, getConnection } from "typeorm"
import UserRoute from "./Controllers/user"
import MessageRoute from "./Controllers/message"
import { User } from "./Models/User"
import { Message } from "./Models/Message"
import jwtExpress from "express-jwt"
import process from "process"

const app = express()
const port = 3000
app.use(express.json())

app.use(
	jwtExpress({ secret: "d586fc96bba6bacb1e9434e22c10635ec3d3631199b8344bb9bd9f5815bdf3bdde8bdc", algorithms: ["HS256"] }).unless({
		path: ["/api/auth", "/api/users"]
	})
)

createConnection({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "",
	database: "typescript",
	entities: [User, Message],
	synchronize: true
})
	.then((connection) => {
		// here you can start to work with your entities
	})
	.catch((error) => console.log(error))

// To use controller
app.use("/api/", UserRoute)
app.use("/api/", MessageRoute)

app.listen(port)
