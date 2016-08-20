const defaultOpts = {
  credentials: 'same-origin'
};

const request = (url, opts, ...rest) => fetch(url, Object.assign({}, defaultOpts, opts), ...rest)
  .then(resp => resp.status < 400 ? resp : Promise.reject(resp));

const json = (...args) => request(...args)
  .then(resp => resp.text())
  .then(text => {
    try {
      return JSON.parse(text);
    } catch(err) {
      return Promise.reject(new Error(`Trying to parse an invalid JSON object: ${text}`));
    }
  });

module.exports = {
  request,
  json
};
