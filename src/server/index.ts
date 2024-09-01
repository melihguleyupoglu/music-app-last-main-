require('dotenv').config()
import { Model } from 'objection'
import Knex from 'knex'
import { strict } from 'assert'
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { promisify } = require('util')

const verifyToken = promisify(jwt.verify)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const decodeToken = promisify(jwt.decode)

const ACCESS_SECRET_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDE3Mjk0MywiaWF0IjoxNzIwMTcyOTQzfQ.YitGYvsMWMBRc22SWfC3HvNLN9WRaNM9QslDBZAXWc8'
const REFRESH_SECRET_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDUxNjA3NywiaWF0IjoxNzIwNTE2MDc3fQ.uswAHArLKhMHkZ3f-N-hH4Ia5d6vFwOxe8eP3pA8HYs'

const generateAccessToken = (username, userId) => {
  return jwt.sign({ username: username, userId: userId }, ACCESS_SECRET_KEY, { expiresIn: '15m' })
}

const generateRefreshToken = (username, userId) => {
  return jwt.sign({ username: username, userId: userId }, REFRESH_SECRET_KEY, { expiresIn: '1d' })
}

const hashPassword = async (password: string) => {
  const saltRounds = 12
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (err) {
    console.error(err)
    throw err
  }
}

const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'melihguleyupoglu',
    password: '1234',
    database: 'music_app'
  }
})

Model.knex(knex)

class User extends Model {
  [x: string]: any
  static get tableName() {
    return 'users'
  }

  static get relationMappings() {
    return {
      children: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'users.parentId'
        }
      }
    }
  }
}

const app = express()
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend'in URL'si
    credentials: true // Cookie'lerin gönderilmesine izin ver
  })
)

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await knex('users').where('username', username).first()
    if (!user) {
      res.status(404).send({ message: 'User not found' })
      return
    }

    const match = await bcrypt.compare(password, user.hashed)
    if (match) {
      const accessToken = generateAccessToken(username, user.id)
      const refreshToken = generateRefreshToken(username, user.id)

      try {
        await knex('users')
          .where('username', username)
          .update({ refresh_token: refreshToken, access_token: accessToken })

        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax'
        })

        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax'
        })

        res.status(200).json({ message: 'Login successful' })
        // console.log(refreshToken, accessToken);
      } catch (error) {
        res.status(500).send({ message: 'Database error: ' + error })
      }
    } else {
      res.status(401).send({ message: 'Passwords are not matching' })
    }
  } catch (error) {
    res.status(500).send({ message: 'Server error: ' + error })
  }
})

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body

  knex
    .select('email')
    .from('users')
    .where('email', email)
    .then((emailList) => {
      if (emailList.length === 0) {
        knex
          .select('username')
          .from('users')
          .where('username', username)
          .then((usernameList) => {
            if (usernameList.length === 0) {
              insertUser(email, username, password)
            } else {
              res.status(204).send({ message: '204' })
            }
          })
      } else {
        res.status(202).send({ message: '202' })
      }
    })

  const insertUser = async (email: string, username: string, password: string) => {
    try {
      const hashedPassword = await hashPassword(password)
      const newUser = await User.query().insert({
        username: username,
        email: email,
        hashed: hashedPassword,
        salt: '20'
      })
      res.status(200).send({
        message: 'User created succesfully.',
        user: newUser
      })
    } catch (error) {
      res.status(500).send({ message: error })
    }
  }
})

app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refresh_token
  console.log(refreshToken)

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' })
  }

  try {
    const user = await knex('users').where('refresh_token', refreshToken).first()

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' })
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decoded = await verifyToken(refreshToken, REFRESH_SECRET_KEY)

      const newAccessToken = generateAccessToken(user.username, user.id)
      await knex('users').where('username', user.username).update('access_token', newAccessToken)

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      })

      res.status(200).json({ accessToken: newAccessToken })
    } catch (err) {
      return res.status(403).send({ message: 'Invalid refresh token' })
    }
  } catch (error) {
    res.status(500).send({ message: 'Server error: ' + error })
  }
})

// app.post('/get-refresh-token', async (req, res) => {
//   const { accessToken } = req.body
//   if (!accessToken) {
//     return res.status(401).json({ message: 'Access token is required' })
//   }
//   const user = await knex('users').where('access_token', accessToken).first()
//   if (!user) {
//     return res.status(403).json({ message: 'User not found' })
//   }

//   const refreshToken = user.refresh_token

//   if (!refreshToken) {
//     return res.status(403).json({ message: 'Refresh token not found' })
//   }
//   return res.status(200).json({ refreshToken: refreshToken })
// })

app.post('/verify-token', async (req, res) => {
  const accessToken = req.cookies.access_token
  console.log(accessToken)
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' })
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decoded = jwt.verify(accessToken, ACCESS_SECRET_KEY)
    return res.status(200).json({ message: 'Token is valid' })
  } catch (error) {
    return res.status(403).json({ message: 'Invalid access token' })
  }
})

app.get('/get-access-token', (req, res) => {
  const accessToken = req.cookies.access_token

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' })
  }
  res.json({ accessToken })
})

// app.get('/is-authenticated', (req, res) => {
//   const accessToken = req.cookies['access_token']
//   if (!accessToken) {
//     return res.status(401).json({ error: 'Not authenticated' })
//   } else {
//     return res.status(200)
//   }
// })

app.post('/logout', (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  })
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  })

  res.status(200).json({ message: 'Logout successful' })
})

app.listen(3000, () => console.log('Server is running on port 3000'))

async function createSchema() {
  if (await knex.schema.hasTable('users')) {
    return
  }

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username')
    table.string('email')
    table.string('hashed')
    table.string('salt')
    table.string('refresh_token')
    table.string('access_token')
  })
}

async function main() {
  console.log('Running')
}

createSchema()
  .then(() => main())
  .then(() => knex.destroy)
  .catch((err) => {
    console.error(err)
    return knex.destroy()
  })
