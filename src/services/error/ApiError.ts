
class ApiError extends Error {
  statusCode: number
  errorType: string
  constructor (statusCode: number = 500, errorType: string = 'Internal Server Error', message?: string) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
    this.statusCode = statusCode
    this.errorType = errorType
  }
}

export default ApiError
