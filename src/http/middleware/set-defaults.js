
const DEFAULTS = {
  credentials: 'same-origin',
  mode: 'same-origin',
}

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
}

function setDefaults ({ headers={}, overrideHeaders=false, ...rest }) {
  return {
    ...DEFAULTS,
    headers: overrideHeaders ? headers : { ...DEFAULT_HEADERS, ...headers },
    ...rest,
  }
}

export default setDefaults