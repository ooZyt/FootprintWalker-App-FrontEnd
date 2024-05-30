/*
 * 通用网络请求工具。
 */
import { HttpStatusCode } from "./HttpStatusCode"
import MacroDefines from "./MacroDefines"

/**
 * 微信 request 函数的请求参数。在此重写一次。
 */
interface RequestParams {
  url: string,
  data?: string | object | ArrayBuffer,
  header?: Object,
  timeout?: number,
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  dataType?: 'json' | '其他',
  responseType?: 'text' | 'arraybuffer',
  enableHttp2?: boolean,
  enableQuic?: boolean,
  enableCache?: boolean,
  enableHttpDNS?: boolean,
  httpDNSServiceId?: string,
  enableChunked?: boolean,
  forceCellularNetwork?: boolean,
}

/**
 * 后端的 IResponse 统一返回格式。
 * 
 * 请求出现问题时，会将可以展示给用户的信息写在msg里（一般情况下）。
 * 请求出现问题时，data可能不可用。
 */
export interface IResponse {
  success: boolean
  msg: string
  data: any
}

/**
 * 微信网络请求成功时的返回结构。这里重新标记一遍。
 */
interface RequestSuccessResult {
  data: string | IResponse | ArrayBuffer
  statusCode: number
  header: Object
  cookies: Array<string>
  profile: Object
}

/**
 * 默认的网络异常处理逻辑：弹出提示信息。
 * 
 * @param isReallyNetworkError 是不是真的是网络错误。当服务器后端出现错误，也会调用此函数。
 */
function defaultNetworkExceptionHandler(isReallyNetworkError: boolean) {
  log('request2: 执行默认网络错误逻辑。')
  log('request2: 推测错误源：' + (isReallyNetworkError ? '网络' : '服务器') + '。')
  wx.showToast({
    icon: 'error',
    title: isReallyNetworkError ? '网络异常' : '服务器异常'
  })

}

/**
 * 默认的未登录处理逻辑：跳转到登录页。
 */
function defaultUnauthorizedExceptionHandler() {
  log('request2: 执行默认鉴权失败处理逻辑。')
  wx.navigateTo({
    url: app.getSharedUrl()
  })
}

let app = getApp()

/**
 * 网络请求工具。
 * 将 wx.request 封装成 promise，且内部处理后端环境配置。
 * 
 * @param params 微信网络请求参数。请将要请求的 url 放置在其中。
 *               如果请求的是果团自有 api，则不要写根路径（https://xxx）。
 *               如果访问的是外部 api，需要令 url 以 https 开头。
 * 
 * @param useDefaultUnauthorizedExceptionHandler 当遇到未登录问题，是否使用默认处理逻辑。默认为使用。
 *                                               仅当 useOriginalResult 设为 false 时有效。
 * 
 * @param useOriginalResult 是否不对数据做预处理。默认做预处理。
 *                          预处理会在网络请求成功时，自动判断是否存在服务器异常及未登录问题，并适当处理。
 *                          同时，会将返回的 IResponse 结构提取，传递给调用者使用。
 *                          若请求的 api 是外部 api，预处理会被强制关闭。
 * 
 * @param useDefaultNetworkExceptionHandler 当遇到网络异常或服务器异常时，是否执行默认处理逻辑。该选项默认开启。
 */
export function request2(
  params: RequestParams,
  useDefaultUnauthorizedExceptionHandler: boolean = true,
  useOriginalResult: boolean = false,
  useDefaultNetworkExceptionHandler: boolean = true
): Promise<IResponse | RequestSuccessResult> {

  /** 请求的根路径。以 http 开头，结尾带横线。 */
  let urlRoot: String

  /** 访问的是否是我们自己的后端 api。我们自己的后端 api 只会返回 IResponse Json 数据。 */
  let isQueryOurApi: boolean

  // 配置 cookies。采用与原 request 兼容的方式。
  let token = app.globalData.token
  if (token === null || token === undefined) {
    token = ''
  }
  let header = params.header
  if (header === null || header === undefined) {
    header = {}
  }
  header['cookie'] = token

  // 识别传入的 url。
  if (params.url.startsWith('https://') || params.url.startsWith('http://')) {
    urlRoot = ''
    isQueryOurApi = false
  } else {

    // 访问自己的 api 时，根据环境绑定目标根地址。
    if (MacroDefines.RUNTIME_ENVIRONMENT == 'dev') {
      urlRoot = MacroDefines.BACKEND_ROOT_DEV
    } else if (MacroDefines.RUNTIME_ENVIRONMENT == 'release') {
      urlRoot = MacroDefines.BACKEND_ROOT_RELEASE
    } else {
      urlRoot = MacroDefines.BACKEND_ROOT_LOCAL
    }

    // 补一个斜杠，这样调用者可以不写第一个斜杠。
    urlRoot += '/'
    isQueryOurApi = true
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: urlRoot + params.url,
      header: header,

      /**
       * 微信网络请求成功时。
       */
      success: (result: RequestSuccessResult) => {

        // 设置 cookies。兼容原 request。
        if (isQueryOurApi && result.cookies.length > 0) {
          app.globalData.token = result.cookies[0]
        }

        // log('request2: 网络请求成功。原始结果如下：')
        // log(result)


        if (isQueryOurApi && !useOriginalResult) {
          // 如果请求的是我们自己的api，并且需要做预处理...

          // log('request2: 尝试进行预处理...')

          if (result.statusCode == HttpStatusCode.OK) {
            // 请求结果看似比较正常。

            log('request2请求'+params.url+'返回数据如下：')
            log(result.data)

            resolve(result.data as IResponse)

          } else if (result.statusCode == HttpStatusCode.UNAUTHORIZED) {
            // 未登录。
            log('request2: 请求错误。未登录。')

            if (useDefaultUnauthorizedExceptionHandler) {
              defaultUnauthorizedExceptionHandler()
            }

            reject(result)
          }
          else {
            // 其他错误。不应该出现啊...

            if (useDefaultNetworkExceptionHandler) {
              defaultNetworkExceptionHandler(false)
            }

            reject(result)
          }

        } else {
          // 如果访问的是外部 api，或已经要求不做预处理。

          log('request2: 跳过预处理。数据原始返回。')

          resolve(result)
        }
      },

      /**
       * 微信网络请求异常时。
       */
      fail: (err) => {

        log('request2: 微信网络请求失败。')

        if (useDefaultNetworkExceptionHandler) {
          defaultNetworkExceptionHandler(true)
        }

        reject(err)
      }
    })
  })
}

function log(...data: any[]) {
  /** 调试模式。"&&" 和 "||" 后的参数可做强制开启或关闭。 */
  let debugMode = (MacroDefines.RUNTIME_ENVIRONMENT != 'release' && true) || false

  if (debugMode) {
    console.log(...data)
  }
}
