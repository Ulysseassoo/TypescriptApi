import express from "express"
const router = express.Router()
import { Message } from "../Models/Message"
import { body, validationResult } from "express-validator"
import { messageValidator } from "../Validator/messageValidator"

router.get("/messages", async (req, res) => {
	const messages = await Message.find()
	res.json({ status: 200, messages: messages })
	return
})

router.post("/messages", messageValidator, async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		res.json({ status: 400, result: "You need to send a content" })
		return
	}

	try {
		const { content } = req.body
		const message = new Message()
		message.content = content
		message.createdAt = new Date()
		// @ts-ignore
		message.user = req.user.id
		const result = await Message.save(message)
		res.json({ status: 200, result: result })
		return
	} catch (error) {
		res.json({ status: 400, result: error })
		return
	}
})

export default router
