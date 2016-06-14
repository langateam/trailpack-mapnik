module.exports = {
  config: {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sslEnabled: true,
    maxRetries: 3,
    logger: process.stdout
  },

  /**
   * Services to instantiate on load.
   *  https://github.com/aws/aws-sdk-js#supported-services
   */
  services: [
    'S3'
  ]
}
