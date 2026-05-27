const path = require('node:path')

module.exports = {
  schemaPath: path.join(__dirname, 'openapi/merged.json'),
  serversPath: './src',
  requestLibPath: "import { request } from '@/request'",
}
