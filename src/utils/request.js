import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['X-Klapi-Authorization'] = getToken()
    config.headers['X-Klapi-Pfalform'] = 'vueapi'
    config.headers['X-Klapi-Fwkey'] = '2587l6QEQ3mPHJZgYTAznd2sN17mlBQZ4CgMNdYoEZJ3'
    if (getToken()) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
  response => {
    const res = response
    res.data.stat = parseInt(res.data.stat)
    if (res.data.msg) {
      var msgtype = 'success'
      if (res.data.msg_type === 0) {
        msgtype = 'error'
      }
      if (res.data.msg_type === 1) {
        msgtype = 'success'
      }
      if (res.data.msg_type === 2) {
        msgtype = 'info'
      }
      if (res.data.msg_type === 3) {
        msgtype = 'warning'
      }
      Message({
        message: res.data.msg,
        type: msgtype
      })
    }
    if (res.data.stat >= 0) { // 正常
      if (res.data.stat === 9) {
        // 未登录
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.fullPath }
        })
      }
      if (res.data.stat === 8) { // 返回上一页
        if (window.history.length <= 1) {
          router.push({
            path: '/'
          })
        } else {
          router.go(-1)
        }
      }
      if (res.data.stat === 6) { // 刷新页面
        location.reload()
      }
      if (res.data.stat === 5) { // 重定向 push history栈中添加一个记录
        if ('router_query' in res.data) {
          if ('router_path' in res.data) {
            // 带参数
            router.push({
              path: res.data.router_path || '/',
              query: res.data.router_query
            })
          } else {
            // 带参数
            router.push({
              path: '/',
              query: res.data.router_query
            })
          }
        } else {
          if ('router_path' in res.data) {
            // 对象
            router.push({
              path: res.data.router_path || '/'
            })
          } else {
            // 首页
            router.push({
              path: '/'
            })
          }
        }
      }
      if (res.data.stat === 4) { // 跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面
        if ('router_query' in res.data) {
          if ('router_path' in res.data) {
            // 带参数
            router.replace({
              path: res.data.router_path || '/',
              query: res.data.router_query
            })
          } else {
            // 带参数
            router.replace({
              path: '/',
              query: res.data.router_query
            })
          }
        } else {
          if ('router_path' in res.data) {
            // 对象
            router.replace({
              path: res.data.router_path || '/'
            })
          } else {
            // 首页
            router.replace({
              path: '/'
            })
          }
        }
      }
      if (res.data.stat === 11) {
        // 退出重新登陆
        // to re-login
        MessageBox.confirm('您必须重新登录,点击确认后登录!', '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // if the custom code is not 200, it is judged as an error.
      return res.data
    } else {
      return Promise.reject(new Error(res.data.msg || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error,
      type: 'error'
      // duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
