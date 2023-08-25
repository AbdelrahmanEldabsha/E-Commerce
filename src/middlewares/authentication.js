// import jwt from "jsonwebtoken"
// import { userModel } from "../../DB/models/user.model.js"
// import { verifyToken } from "../utils/tokenFunctions.js"

// export const isAuth = () => {
//   try {
//     return async (req, res, next) => {
//       const { authorization } = req.headers
//       if (!authorization) {
//         return res.status(400).json({ message: "Please login first" })
//       }
//       if (!authorization.startsWith(process.env.TOKEN_PREFIX)) {
//         return res.status(400).json({ message: "invalid token prefix" })
//       }

//       const splitedToken = authorization.split(" ")[1]
//       try {
//         const decodedData = verifyToken({
//           token: splitedToken,
//           secretKey: splitedToken,
//         })
//         if (!decodedData || !decodedData.id) {
//           return res.status(400).json({ message: "invalid token" })
//         }

//         const findUser = await userModel.findById(decodedData.id, "-password")
//         if (!findUser) {
//           return res.status(400).json({ message: "Please SignUp first" })
//         }
//         if (findUser.isDeleted) {
//           return res
//             .status(400)
//             .json({ message: "this email is deleted, please login again" })
//         }
//         if (!findUser.isOnline) {
//           return res.status(400).json({ message: "please sign in first" })
//         }
//         // retrun findUser
//         req.authUser = findUser
//         next()
//       } catch (error) {
//         if(err=='TokenExpiredError: jwt expired'){
//              // refresh token
//           const user = await userModel.findOne({ token: splitedToken })
//           if (!user) {
//             return next(new Error('Wrong token', { cause: 400 }))
//           }
//         }
//       }
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Fail" })
//   }
// }
