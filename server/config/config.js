const env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test') {
    const config = require('./config.json')
    const envConfig = config[env]

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]
    })
}

console.log('env >>>>>>> ', env)

// {
//     "test": {
//         "PORT": 3000,
//         "MONGODB_URI": "mongodb://localhost:27017/TodoAppTest",
//         "JWT_SECRET": "abodkekoskek20sls93l"
//     },
//     "development": {
//         "PORT": 3000,
//         "MONGODB_URI": "mongodb://localhost:27017/TodoApp",
//         "JWT_SECRET": "aiw20solslsw93lfvfjmv"
//     }
// }