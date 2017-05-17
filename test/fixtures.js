/* FIXTURES */

import { LP_API } from '../src'

export const REQUEST_KEY = 'REQUEST_KEY'
export const ACTION_TYPE_REQUEST = 'ACTION_TYPE_REQUEST'
export const ACTION_TYPE_SUCCESS = 'ACTION_TYPE_SUCCESS'
export const ACTION_TYPE_FAILURE = 'ACTION_TYPE_FAILURE'

export const actionWithURL = (url) => {
  return {
    [LP_API]: {
      url,
      requestKey: REQUEST_KEY,
      actions: [ACTION_TYPE_REQUEST, ACTION_TYPE_SUCCESS, ACTION_TYPE_FAILURE]
    }
  }
}