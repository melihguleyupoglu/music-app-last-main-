require('dotenv').config()
import { Model } from 'objection'
import Knex from 'knex'
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
// const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt')

const ACCESS_SECRET_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDE3Mjk0MywiaWF0IjoxNzIwMTcyOTQzfQ.YitGYvsMWMBRc22SWfC3HvNLN9WRaNM9QslDBZAXWc8'
const REFRESH_SECRET_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDUxNjA3NywiaWF0IjoxNzIwNTE2MDc3fQ.uswAHArLKhMHkZ3f-N-hH4Ia5d6vFwOxe8eP3pA8HYs'

const generateAccessToken = (username) => {
  return jwt.sign({ username }, ACCESS_SECRET_KEY, { expiresIn: '15m' })
}

const generateRefreshToken = (username) => {
  return jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' })
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
app.use(cors())

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const storedHashPassword = await knex.select('hashed').from('users').where('username', username)

    if (storedHashPassword.length === 0) {
      res.status(404).send({ message: 'Kullanıcı bulunamadı' })
      return
    }

    const match = await bcrypt.compare(password, storedHashPassword[0].hashed)
    if (match) {
      const accessToken = generateAccessToken(username)
      const refreshToken = generateRefreshToken(username)
      try {
        await knex('users').where('username', username).update({ refresh_token: refreshToken })

        res.status(200).json({ accessToken, refreshToken })
        // console.log(refreshToken, accessToken);
      } catch (error) {
        res.status(500).send({ message: 'Veritabanı hatası: ' + error })
      }
    } else {
      res.status(401).send({ message: 'Şifreler eşleşmiyor' })
    }
  } catch (error) {
    res.status(500).send({ message: 'Sunucu hatası: ' + error })
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

app.post('/refresh', async (req, res) => {
  const { refresh_token: refreshToken } = req.body
  // console.log(refreshToken);

  if (!refreshToken) {
    return res.status(401).send({ message: 'Refresh token is required' })
  }

  try {
    const user = await knex('users').where('refresh_token', refreshToken).first()

    if (!user) {
      return res.status(403).send({ message: 'Invalid refresh token' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid refresh token2' })
      }

      const newAccessToken = generateAccessToken(user.username)
      res.status(200).json({ accessToken: newAccessToken })
    })
  } catch (error) {
    res.status(500).send({ message: 'Server error' + error })
  }
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
