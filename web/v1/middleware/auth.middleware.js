const JWT = require('jsonwebtoken')
const client = require('./../../../connection/redisconnection')

module.exports = {
  signAccessToken: (username) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '300000',
        issuer: 'hatson.com',
        audience: username
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err)
          return
        } else {
          resolve(token)
        }

      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    console.log(req.headers['authorization'])
    if (!req.headers['authorization']) {
      return res.json({ status: false, msg: "Authorization" })
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return res.json({ status: false, msg: message });
      }
      req.payload = payload
      next();
    })
  },
  signRefreshToken: (username) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '300000',
        issuer: 'hatson.com',
        audience: username,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err.message)
        }

        client.SET(username, token, 'EX', 60 * 60, (err, reply) => {
          if (err) {
            reject(err.message)
            return
          } else {
            resolve(token)
          }

        })
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(err.message)
          }
          const userName = payload.aud;
          client.GET(userName, (err, result) => {
            if (err) {
              reject(err.message)
              return
            }
            if (refreshToken === result) {
              return resolve(userName);
            }
            else {
              return reject(err)
            }
          })
        }
      )
    })
  },
}
