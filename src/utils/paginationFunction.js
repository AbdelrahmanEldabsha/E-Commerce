export const paginationFunction = ({ page = 1, size = 2 }) => {
  page < 1 ? (page = 1) : 1
  size < 1 ? (size = 2) : 1

  const limit = size
  const skip = (page - 1) * size

  return { limit, skip }
}
