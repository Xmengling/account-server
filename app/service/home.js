'use strict';

const Service = require('egg').Service

class HomeService extends Service {
  async user() {
    return {
      name: '111',
      slogan: '222'
    }
  }
}

module.exports = HomeService