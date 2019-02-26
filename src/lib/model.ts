import {
  BankCardData,
  Config,
  Device as DeviceBase,
  Options,
} from '@waiting/bankcard-reader-base'
import {
  DModel as M,
  FModel as FM,
} from 'win32-def'


export {
  BankCardData,
  Config,
  Options,
}

/* sdtapi.dll 接口方法类型 */
export interface DllFuncsModel extends FM.DllFuncsModel {
  /** 查找设备并打开端口 0 成功 */
  OpenComPort(port: M.INT32, gate: M.POINT, baud: M.INT32, timeout: M.INT32): M.INT32
  CloseComPort(): M.INT32
  /** 检查端口是否已打开1， 0未打开 */
  IsComOpen(): M.INT32

  /**
   * 获取银行磁卡号，自动.
   * 执行结果0 成功
   *
   */
  GetCardNumberFromDev(
    /** 串口号 */
    port: M.INT32,
    /** 扩展口 */
    gate: M.POINT,
    /** 超时时间 (主要为磁卡的超时时间) */
    timeout: M.INT32,
    /** 获取到的卡号 */
    cardBuff: M.POINT,
  ): M.INT32

  /**
   * 获取IC卡信息
   * 获取信息的来源 (前面的模块获取不到则往后递推尝试获取)2非接，1接触，0磁卡 '2121021' ''则默认为'210'
   *
   * 工作不正常
   */
  // GetCardInfoFromDev(
  //   selectType: Buffer,
  //   port: number,
  //   gate: Buffer,
  //   timeout: number,
  //   cardBuff: Buffer,
  // ): void
}

/** 读卡设置 */
export interface Device extends DeviceBase {
  apib: DllFuncsModel
}
