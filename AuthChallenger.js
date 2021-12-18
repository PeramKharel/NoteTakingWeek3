require("dotenv").config()

const AuthChallenger = () => {
  return async (username, password, cb) => {
    let knex = require("knex")({
      client: "postgresql",
      connection: {
        database: process.env.DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      }
    })
    try {
      let result = await knex("users").where({
        username: username,
        password: password
      }).select("username")
      if (result.length === 1) {
        return cb(null, true)
      } else {
        console.log(`User not found!`)
        return cb(null, false)
      }
    } catch (error) {
      console.log(error)
    }
  };
};

module.exports = AuthChallenger;
