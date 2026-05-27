import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import ACCESS_ENUM from '@/access/accessEnum.ts'

/**
 * 防止 Java Long 精度丢失的 JSON 解析器。
 *
 * 原生 JSON.parse 会把超出 JS MAX_SAFE_INTEGER (2^53-1) 的整数直接截断，
 * 比如 2054541788105461761 → 2054541788105461800，且 transformResponse 拿到的
 * 是原始字符串，所以这里用 Douglas Crockford 风格的 token-walk 法，
 * 在交给 JSON.parse 之前把超范围的裸数字加上引号，变成字符串。
 */
function parseSafeBigInt(raw: string): unknown {
  // 逐 token 扫描：字符串/布尔/null 原样保留，仅对超范围整数加引号
  const safe = raw.replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^"\\])*")|(-?\d{16,}(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match, str, bigNum) => {
      if (str !== undefined) return str      // 字符串 token，原样保留
      if (bigNum !== undefined) {
        // 整数部分 ≥ 16 位，直接加引号（JS 最大安全整数是 15 位数字 9007199254740991）
        return '"' + bigNum + '"'
      }
      return match
    },
  )
  return JSON.parse(safe)
}

const myAxios = axios.create({
  baseURL: 'http://localhost:8100/api',
  timeout: 60000,
  withCredentials: true,
  transformResponse: [
    (rawData: string) => {
      if (typeof rawData !== 'string') return rawData
      try {
        return parseSafeBigInt(rawData)
      } catch {
        return rawData
      }
    },
  ],
})

// 响应拦截器
myAxios.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 40100) {
      const needAccess = router.currentRoute.value.meta.access ?? ACCESS_ENUM.NOT_LOGIN
      if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default myAxios

export async function request<T = any>(
  url: string,
  options?: { method?: string; data?: any; params?: any; headers?: any; [key: string]: any },
): Promise<T> {
  const { data, params, method = 'GET', headers, ...rest } = options ?? {}
  const res = await myAxios.request<any, any>({ url, method, data, params, headers, ...rest })
  return res
}
