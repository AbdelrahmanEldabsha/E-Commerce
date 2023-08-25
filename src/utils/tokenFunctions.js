import jwt, { verify } from "jsonwebtoken"

export const generateToken = ({
  payload = {},
  signature = process.env.DEFAULT_SIGNATURE,
  expiresIn = "1d",
} = {}) => {
  // check if the payload is empty object
  if (!Object.keys(payload).length) {
    return false
  }
  const token = jwt.sign(payload, signature, { expiresIn })
  return token
}

export const verifyToken = ({
  token = "",
  secretKey = process.env.TOKEN_SECRET_KEY,
} = {}) => {
  if (!token) {
    return false
  }
  const data = verify(token, secretKey)
  return data
}
