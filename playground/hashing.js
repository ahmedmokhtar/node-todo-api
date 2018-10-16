const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

const data = {
    id: 10
}

const token = jwt.sign(data, '123abc')
const decoded = jwt.verify(token, '123abc')

console.log(token)
console.log('decoded:', decoded)

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