/**
 * 全局宏定义。
 */
export default class MacroDefines {
  private constructor() { }

  /* ------------ 网络请求相关 ------------ */

  /* 程序运行环境。 
   * 在这里切换接入的后端是测试服还是正式服，或者是本地服。
   *    可选值    含义
   *    dev      测试环境
   *    release  正式环境
   *    local    本地
   *    custom   自定义
   * 
   * 注意：
   *   正式服对应：
   *   测试服对应：
   *   本地服对应：http://localhost:9000
   * 
   * 如果上面的地址都不满意，请将本值设为 custom，并在下方手动更改 url 的值。
   */
  static RUNTIME_ENVIRONMENT: 'local' | 'dev' | 'release' = 'dev'

  /** 测试后端。 */
  static BACKEND_ROOT_DEV = ''

  /** 生产后端。 */
  static BACKEND_ROOT_RELEASE = ''

  /** 本地后端。 */
  static BACKEND_ROOT_LOCAL = 'http://localhost:9000'


  /* ------------ 持久化小数据键 ------------ */

  /** MiSans 字体是否已下载。 */
  static MISANS_DOWNLOADED = '__misans-f-downloaded'
}
