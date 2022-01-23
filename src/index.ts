import dotenv from "dotenv"
import path from "path"
import express from "express"
import RandomUser from "./Services/randomuser"
import "reflect-metadata"
import http from "http"
import { createConnection } from "typeorm"
import UserRoute from "./Routes/user"
import MessageRoute from "./Routes/message"
import { User } from "./Models/User"
import { Message } from "./Models/Message"
import jwtExpress from "express-jwt"
import process from "process"
import cors from "cors"

declare global {
	namespace Express {
		interface User {
			id: number
			firstname: string
			lastname: string
			email: string
			password: string
			messages: Message[]
		}
	}
}

// In order to use our Private keys we set up config.env file

dotenv.config({
	path: path.resolve(__dirname, "config.env")
})

const app = express()
const port = 3000
const server = http.createServer(app)
import { Server } from "socket.io"
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

const secret = process.env.JWT_SECRET

app.use(express.json())
app.use(cors())

app.use(
	jwtExpress({ secret: secret, algorithms: ["HS256"] }).unless({
		path: ["/api/auth", "/api/users"]
	})
)

app.use(async (req, res, next) => {
	if (req.user) {
		req.user = await User.findOne({ where: { id: req.user.id } })
		next()
	} else {
		next()
	}
})

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

io.on("connection", (socket) => {
	console.log(`a user connected: ${socket.id}`)
	socket.on("message", (message) => {
		io.emit("message", message)
	})
})

server.listen(port)
