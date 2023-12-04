const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const User = require('./user')

mongoose.connect('mongodb+srv://onlyirina7:IrinaDan2023@cluster0.pri7c4d.mongodb.net/auth?retryWrites=true&w=majority')
const app= express()

app.use(express.json())

const signToken = _id => jwt.sign({_id }, 'secreto')

app.post('/register', async (req, res) => {
    const { body} = req
    console.log({body})
    try{
        const isUser = await User.findOne({email: body.email })
        if (isUser) {
            return res.send('usuario ya existe')
        }
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({email: body.email, password: hashed, salt })
        const signed = signToken(user._id)

        res.status(201).send(signed)

    }catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }

})
app.post('/login', async (req, res) => {
    const { body } = req
    try {
        const user = await User.findOne({ email: body.email})
        if(!user) {
            res.status(403).send('usuario y/o contraseña invalida')
        } else {
            const isMatch = await bcrypt.compare(body.password, user.password)
            if(isMatch) {
                const signed = signToken(user._id)
                res.status(200).send(signed)

            }else{
                res.status(403).send('usuario y/o contraseña invalida')
            }
        }
    }catch(err) {
        res.status(500).send(err.message)
    }
})
const findAndAssignerUser = async(req, res, next) => {
  try{
    if(!user){
      return res.status(401).end()
    }
    req.user = user
    next()
  } catch(e) {
    next(e)
  }
}

const isAuthenticaded = express.Router().use(validateJwt, findAndAssignerUser)

app.get('/lele', validateJwt, findAndAssignerUser, (req, res) => {
  throw new Error('nuevo error')
  res.send(req.user)
})
/*Manejar el error*/
app.use((err, req, res, next) =>{
  console.error('Mi nuevo error', err.stack)
  next(err)
})
app.use((err, req, res, next) =>{
  res.send('Ha ocurrido un error')
})

app.listen(3000, () => {
    console.log('listening in port 3000')
})