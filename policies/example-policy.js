// const requestify = require('requestify');
// requestify.cacheTransporter(coreCacheTransporters.inMemory());

const axios = require('axios')
const setupCache = require('axios-cache-adapter')

module.exports = {
  name: 'authorizing',
  policy: (actionParams) => {
    return (req, res, next) => {
      const baseURL = actionParams.baseUrl
      // Create axios-cache-adapter instance
      const cache = setupCache({
        maxAge: 15 * 60 * 1000
      })

      axios.create({
        timeout: 5000,
        adapter: cache.adapter
      })

      const userInfo = actionParams.userInfo
      axios({
        url: `${baseURL}/${userInfo}`,
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization
        }
      })
        .then(response => {
          req.user = response.data
          next()
        })
        .catch(error => {
          console.log('error =>', error)
        })
    //   requestify.post(`${baseUrl}/${userInfo}`, {},
    //   //   { cache: {
    // 	//   cache: true, // Will set caching to true for this request.
    // 	//   expires: 3600 // Time for cache to expire in milliseconds
    //   // }}
    //   )
    // .then((response) => {
    //    const body = response.getBody();
    //    console.log('body =>', body);
    //    next();
    // })
    // .catch(error => {
    //   console.log('erorr =>', erorr);
    // });
    }
  }
}
