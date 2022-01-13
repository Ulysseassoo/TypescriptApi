export interface User {
	gender: string
	name: Name
	location: Location
	email: string
	login: Login
	dob: Dob
	registered: Dob
	phone: string
	cell: string
	id: ID
	picture: Picture
	nat: string
}

interface Dob {
	data: string
	age: number
}

interface Street {
	number: number
	name: string
}

interface Coordinates {
	latitude: string
}

interface Timezone {
	offset: string
	description: string
}

interface Location {
	street: Street
	city: string
	state: string
	country: string
	postcode: number
	coordinates: Coordinates
	timezone: Timezone
}

interface ID {
	name: string
	value: number
}

interface Login {
	uuid: string
	username: string
	password: string
	salt: string
	md5: string
	sha1: string
	sha256: string
}

interface Name {
	title: string
	first: string
	last: string
}

interface Picture {
	large: string
	medium: string
	thumbnail: string
}
