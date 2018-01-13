'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://app_user:mtek9002@ds013495.mlab.com:13495/web-mongolab'
    uri: 'mongodb://localhost:27017/web-dev'
  },

  // Seed database on startup
  seedDB: true

};
