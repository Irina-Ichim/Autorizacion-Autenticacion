const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = ('express-jwt')

mongoose.connect('mongodb+srv://onlyirina7:IrinaDan2023@cluster0.pri7c4d.mongodb.net/auth?retryWrites=true&w=majority')
const app= express()

app.use(express.json())