/**
 * 
 * An error class that is thrown by the {@link http} module when a request fails.
 *
 * In addition to the standard [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) attributes, instances of `HttpError` include the following:
 * - `status`: the status code of the response
 * - `statusText`: the status text of the response
 * - `response`: the full response object
 * - `message`: A readable error message with format `<status> - <statusText>`
 *
 * @param {Number} status - the status code of the response
 * @param {String} statusText - the status text of the response
 * @param {Object} response - the full response object
 * @param {Object} [errors=[]] - an array of error messages associated with the response
 * 
 * @example
 *
 * // Instantiated manually
 * const MyError = new HttpError(500, 'Something went wrong!')
 * console.log(MyError.toString()) // "HttpError: 500 - Something went wrong"
 *
 * // Instantiated by http module
 * http('/bad-route').catch(err => console.log(err.name)) // -> "HttpError"
 */

export default class HttpError extends Error {
  constructor (status, statusText, response, errors=[]) {
    super()
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.response = response
    this.errors = errors
    this.message = `${status} - ${statusText}`
  }
}
