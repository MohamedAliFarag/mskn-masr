const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const User = require('../models/user')
const Product = require('../models/product')

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  resources: [User,Product],
  rootPath: '/admin',
  branding : {companyName : 'Maskn Masr'}
})

//admin credtianls
const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
}

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN
    }
    return null
  },
  cookieName: process.env.ADMIN_COOKIENAME,
  cookiePassword: process.env.ADMIN_COOKIEPASSWORD,
})
module.exports = router