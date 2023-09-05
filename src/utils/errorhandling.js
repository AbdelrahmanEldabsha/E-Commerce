export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      console.log(err)
      req.error = err
      return next(new Error(`Fail: ${err}`, { cause: 500 }))
    })
  }
}

export const globalResponse = (err, req, res, next) => {
  if (req.error) {
    return res.status(err["cause"] || 500).json({ message: req.error })
  }
  if (err) {
    return res.status(err["cause"] || 500).json({ message: err.message })
  }
}
