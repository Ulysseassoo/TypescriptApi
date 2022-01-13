import axios from "axios"
import { User } from "../Interfaces/interfaceUser"

class RandomUser {
	static async getOne() {
		let reponse = await axios.get("https://randomuser.me/api/")

		let user = reponse.data.results[0] as User

		return user
	}
}

export default RandomUser
