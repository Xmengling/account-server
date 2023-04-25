'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const { id } = ctx.query
    // ctx.body = id;
    await ctx.render('index.html', {
      title: '小小梦'
    })
  }
  async user() {
    const { ctx } = this
    const { id } = ctx.params
    const { name, slogan } = await ctx.service.home.user()

    ctx.body = {
      name,
      slogan
    }
  }
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
    ctx.body = {
      title
    };
  }
}

module.exports = HomeController;
