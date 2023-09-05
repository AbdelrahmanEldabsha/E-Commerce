import * as allRouters from "../index.routes.js"
import { ConnectionDB } from "../../DB/connection.js"
import { globalResponse } from "./errorhandling.js"
export const initiateApp = (express, app) => {
  const port = process.env.PORT
  ConnectionDB()
  app.use(express.json())
  app.use("/category", allRouters.categoryRouter)
  app.use("/subCategory", allRouters.subCategoryRouter)
  app.use("/brand", allRouters.brandRouter)
  app.use("/product", allRouters.productRouter)

  app.all("*", (req, res, next) =>
    res.status(404).json({ message: "404 Not Found URL" })
  )
  app.use(globalResponse)
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
