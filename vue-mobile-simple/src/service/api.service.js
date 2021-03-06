import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import { VueAxios } from './../plugins/vue-axios';
import JwtService from './../service/jwt.service';
import ApiConfig from './../config/app.config';

// 创建取消请求令牌
let CancelToken = axios.CancelToken;

export default {
  init() {
    Vue.use(VueAxios, axios);

    // 请求拦截器
    Vue.axios.interceptors.request.use((config) => {
      let conf = config;
      // 发起请求时，取消掉当前正在进行的相同请求
      let requestName = conf.data.requestName;
      if (requestName) {
        if (axios[requestName] && axios[requestName].cancel) {
          axios[requestName].cancel();
        }
        conf.cancelToken = new CancelToken((c) => {
          axios[requestName] = {};
          axios[requestName].cancel = c;
        });
      }
      return conf;
    }, error => Promise.reject(error));

    // 默认错误处理方式
    let onError = function (error) {
      if (error.message) {
        return true;
      }
      // 使用 类似 Toast 组件进行错误提示
      return {
        title: '请求错误',
        type: 'error',
        message: error.message || '请求发生错误',
      };
    };

    // 响应拦截器
    Vue.axios.interceptors.response.use(
      response => response,
      (error) => {
        let err = error;
        if (err && err.response) {
          switch (err.response.status) {
            case 400: err.message = '请求错误(400)'; break;
            case 401:
              // 401: 未登录
              // 未登录则跳转登录页面，并携带当前页面的路径
              // 在登录成功后返回当前页面，这一步需要在登录页操作。
              err.message = '未授权，请重新登录(401)';
              break;
            case 403:
              // 403 Token过期
              // 登录过期对用户进行提示
              // 清除本地token和清空vuex中token对象
              // 跳转登录页面
              err.message = '拒绝访问(403)';
              break;
            case 404: err.message = '请求错误(404)'; break;
            case 408: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务器未实现(501)'; break;
            case 502: err.message = '网络错误(503)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default:
              err.message = `错误类型(${err.response.status})`;
          }
        } else {
          err.message = '连接到服务器失败';
        }
        onError(err);
        return Promise.resolve(err.response);
      });

    // 环境的切换
    if (process.env.NODE_ENV === 'development') {
      Vue.axios.defaults.baseURL = '/';
    } else if (process.env.NODE_ENV === 'production') {
      Vue.axios.defaults.baseURL = ApiConfig.BASE_URL;
    }

    // 请求超时时间
    Vue.axios.defaults.timeout = 10000;

    // 设置默认请求头
    Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    Vue.axios.defaults.headers.common.Accept = 'application/json, text/plain, */*';
    Vue.axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin';
  },

  setHeader() {
    Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`;
    // Vue.axios.defaults.timeout = 8000;
    // Vue.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // Vue.axios.defaults.headers.common['Content-Type'] = 'application/json';
    // Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Vue.axios.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
    // Vue.axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin';
    // post请求头
    // Vue.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  },

  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  async get(url, params) {
    /**
     * params{
     *  id,
     *  name：string
     * } ==> ?id=id&name=string
     */
    try {
      const query = await qs.stringify(params);
      let res = null;
      if (!params) {
        res = await Vue.axios.get(url);
      } else {
        res = await Vue.axios.get(`${url}?${query}`);
      }
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },

  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
  async post(url, params) {
    try {
      const res = await Vue.axios.post(url, params);
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async patch(url, params) {
    try {
      const res = await Vue.axios.patch(url, params);
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async put(url, params) {
    try {
      const res = await Vue.axios.put(url, params);
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async delete(url, params) {
    /**
     * params默认为数组
     */
    try {
      const res = await Vue.axios.post(url, params);
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async upload(url, formdata) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const res = await Vue.axios.post(url, formdata, config);
      return res;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
};

// 文章服务
// export const ArticlesService = {
//   get(url, params) {
//     return ApiService.get('articles', params);
//   },
//   create(params) {
//     return ApiService.post('articles', { article: params });
//   },
//   update(params) {
//     return ApiService.update('articles', { article: params });
//   },
//   destroy() {
//     return ApiService.delete(`articles`);
//   },
// };

// 其他服务
