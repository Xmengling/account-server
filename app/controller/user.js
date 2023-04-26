'use strict';

const { Controller } = require('egg');

// 默认头像
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
  async register() {
    const { ctx } = this;

    // 校验必填
    const { username, password } = ctx.request.body;
    if(!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null
      }
      return
    }

    // 校验是否重复
    const userInfo = await ctx.service.user.getUserByName(username);
    if(userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '用户名已被注册，请重新输入！',
        data: null
      }
      return
    }

    const result = await ctx.service.user.register({
      username,
      password,
      signature: '春暖花开',
      avatar: defaultAvatar
    })

    if(result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null
      }
    }
  }

  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if(!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '该用户不存在',
        data: null
      }
      return
    }
    if(userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '密码不正确',
        data: null
      }
      return
    }
    // 生成 token
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
    const token = app.jwt.sign({
      username,
      password,
      exp: Math.floor(Date.now() / 1000) + ( 24 * 60 * 60) // token 有效期为 24 小时
    })

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token
      }
    }
  }

  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        ...decode
      }
    }
  }
}

module.exports = UserController;