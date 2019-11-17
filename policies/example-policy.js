const http = require('http');

module.exports = {
  name: 'authorizing',
  policy: (actionParams) => {
    return (req, res, next) => {
      const endpoint = config.gatewayConfig.serviceEndpoints[actionParams.serviceEndpoint];
      const userInfo = actionParams.userInfo;
      console.log('Requesting to: ', `${endpoint}/${userInfo}`);
      const userInfoReqOptions = {
        hostname: endpoint,
        port: 80,
        path: userInfo,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers || req.headers.authorization
        }
      };
      const requestUserInfo = http.request(userInfoReqOptions, function(userInfoResponse) {
        console.log('Status: ' + userInfoResponse.statusCode);
        console.log('Headers: ' + JSON.stringify(userInfoResponse.headers));
        userInfoResponse.setEncoding('utf8');
        userInfoResponse.on('data', function (body) {
          console.log('Body: ' + body);
          req.user = body;
          next();
        });
      });
      requestUserInfo.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        res.end('PROBLEM_WITH_USER_INFO_REQUEST');
      });
    }
  },
  schema: { // This is for Admin API to validate params
    type: 'object',
    properties: {
      url: {
        title: 'url',
        description: 'the url to initialize',
        type: 'string',
        required: false
      }
    }
  }
}
