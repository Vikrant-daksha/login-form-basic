module.exports = {
    mongodb: {
      server: 'mongo',      // your MongoDB service name in Docker Compose
      port: 27017,
      ssl: false,
      auth: [
        {
          database: 'admin',  // the database where user is created
          username: 'root',   // MongoDB username
          password: 'example' // MongoDB password
        }
      ]
    },
    site: {
      baseUrl: '/',
      cookieKeyName: 'mongo-express',
      cookieSecret: 'cookiesecret',
      sessionSecret: 'sessionsecret',
      port: 8081,
      requestSizeLimit: '50mb',
      sslCert: '',
      sslEnabled: false,
      sslKey: ''
    }
  };
  