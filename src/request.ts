import axios from 'axios'
import { message } from 'ant-design-vue'

const myAxios = axios.create({
  baseURL: 'http://localhost:8123/api',
  timeout: 60000,
  withCredentials: true,
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  const { data } = response
  if (data.code === 40100) {
    // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
    if (
      !response.request.responseURL.includes('user/get/login') &&
      !window.location.pathname.includes('/user/login')
    ) {
      message.warning('请先登录')
      window.location.href = `/user/login?redirect=${window.location.href}`
    }
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default myAxios

export async function request<T = any>(
  url: string,
  options?: { method?: string; data?: any; params?: any; headers?: any; [key: string]: any },
): Promise<T> {
  const { data, params, method = 'GET', headers, ...rest } = options ?? {}
  const res = await myAxios.request<any, any>({ url, method, data, params, headers, ...rest })
  return res
}
