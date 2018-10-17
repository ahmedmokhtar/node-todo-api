const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const password = 'abc123'

// // Promise based
// bcrypt.genSalt(10).then((salt) => {
//     return bcrypt.hash(password, salt)
// }).then((hash) => {
//     console.log(hash)
// }).catch((err) => {
//     console.log(err)
// })

// // Callback based
// bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//         return console.log(err)
//     }
//     bcrypt.hash(password, salt, (err, hash) => {
//         if (err) {
//             return console.log(err)
//         }
//         console.log(hash)
//     })
// })

// Compare hashedPassword to password
const hashedPass1 = '$2a$10$H8lnh7zUf1HsvsmJK1zRe.FvykLS1jeA1pVXUmeEDCBDd7IaYB7wa'
const hashedPass2 = '$2a$10$cctEYevCNu5c0mCteGmxuux.3wM9IeEqL0i8KlcIscHLDuk/dy1Au'

bcrypt.compare(password, hashedPass1).then((res) => {
    console.log(res)
}, (rej) => {
    console.log(rej)
})

bcrypt.compare(password, hashedPass2).then((res) => {
    console.log(res)
}, (rej) => {
    console.log(rej)
})

// const data = {
//     id: 10
// }

// const token = jwt.sign(data, '123abc')
// const decoded = jwt.verify(token, '123abc')

// console.log(token)
// console.log('decoded:', decoded)

// const message = 'I am user number 3'
// const hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// const data = {
//     id: 4
// }

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5
// token.hash = SHA256(JSON.stringify(data)).toString()

// const hashResult = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (hashResult === token.hash) {
//     console.log('Data is trusted')
// } else {
//     console.log('Data has changed. Do not trust')
// }