import express from "express"
const router = express.Router()
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import process from "process"
import { User } from "../Models/User"
import { validationResult } from "express-validator"
import { userValidator } from "./../Validator/userValidator"

// -------------------------------------------------------------------------- FUNCTIONS -------------------------------------------------------------
const generateSignedToken = (user: User) => {
	return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	})
}

const isValid = (email: string) => {
	let regEmail = /^w+[+.w-]*@([w-]+.)*w+[w-]*.([a-z]{2,4}|d+)$/i
	if (regEmail.test(email)) {
		return true
	}
	return false
}

const sendToken = (user: User, statusCode: number, res: any) => {
	const token = generateSignedToken(user)
	res.status(statusCode).json({
		status: statusCode,
		token: `Bearer ${token}`,
		userInfo: {
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname
		}
	})
}

// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.post("/users", userValidator, async (req: express.Request, res: express.Response) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		res.status(401).send({
			status: 401,
			message: errors
		})
		return
	}

	const { email, password, firstname, lastname } = req.body

	const salt = bcrypt.genSaltSync(6)
	let passwordEncrypted = bcrypt.hashSync(password, salt)

	const user = new User()
	user.firstname = firstname
	user.lastname = lastname
	user.password = passwordEncrypted
	user.email = isValid ? email : null

	try {
		const result = await User.save(user)
		res.json({ status: 201, result: result })
		return
	} catch (error) {
		res.status(401).send({
			status: 401,
			message: error
		})
		return
	}
})

router.post("/auth", async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		res.status(400).send("Please provide an email and password")
		return
	}

	try {
		const user = await User.findOne({
			where: {
				email: req.body.email
			}
		})
		console.log(user)
		if (!user) throw Error
		const isMatch = bcrypt.compareSync(password, user.password)
		console.log(isMatch)
		if (isMatch === false) throw Error
		sendToken(user, 200, res)
		return
	} catch (error) {
		console.log(error)
		res.status(401).send({
			status: 401,
			message: "Invalid credentials"
		})
		return
	}
})

router.get("/users/me", async (req, res) => {
	console.log(req.user)
	// @ts-ignore
	const user = await User.findOne({ where: { id: req.user.id } })

	res.json({ data: user })
})

export default router
