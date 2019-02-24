import {
  Config,
} from '@waiting/idcard-reader-base'


export {
  Config,
}

export type Options = Partial<DeviceOpts>


export interface DeviceOpts {
  /* path of dll */
  dllTxt: string
  /* 找卡重试数量，间隔1sec */
  findCardRetryTimes: number
  debug: boolean
  port: number
  /* search all available device , stop searching at first device found if false */
  searchAll: boolean
}


/* sdtapi.dll 接口方法类型 */
export interface DllFuncsModel {
  OpenComPort(port: number, gate: Buffer, baud: number, timeout: number): number // 查找设备并打开端口 0 成功
  CloseComPort(): number
  IsComOpen(): number // 检查端口是否已打开1， 0未打开

  /**
   * 获取银行磁卡号，自动.
   * 执行结果0 成功
   *
   */
  GetCardNumberFromDev(
    /** 串口号 */
    port: number,
    /** 扩展口 */
    gate: Buffer,
    /** 超时时间 (主要为磁卡的超时时间) */
    timeout: number,
    /** 获取到的卡号 */
    cardBuff: Buffer,
  ): number

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
export interface Device {
  apib: DllFuncsModel
  deviceOpts: DeviceOpts
  /** device in use */
  inUse: boolean
  openPort: number
}

export interface BankCardData {
  cardno: string
}
