# leanne1-REST-express

REST API built with Express and MongoDB

## Install

- Clone this repo
- `npm i`
- [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

## Install
- Start the Mongo daemon: `mongod`
- `npm run dev`
- Post a request in Postman / curl to: `https://localhost:3000/api/**`


## Endpoints

- `/users/` `POST` - register a user
- `/users/me` `GET`
- `/auth` `POST` - authenticate a user, returns a [JWT](https://jwt.io/)
- `/genres/:id` `GET, POST, PUT, DELETE`
- `/movies/:id` `GET, POST, PUT, DELETE`
- `/customers/:id`, `GET, POST, PUT, DELETE`
- `/rentals/` `GET, POST`

- Use Mongo Compass to update a user's roleto include `admin` before re-authenticating  for
`PUT` and `DELETE` requests
- Request body validation errors will provide required request body keys
