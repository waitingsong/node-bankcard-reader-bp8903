import {
  join,
  tmpdir,
} from '@waiting/shared-core'
import {
  DTypes as W,
  FModel as FM,
} from 'win32-def'

import {
  Config,
  Options,
} from './model'


export const config: Config = {
  appDir: '',  // update by entry point index.js
  tmpDir: join(tmpdir(), 'idcard-reader'),
}


// 初始化参数
export const initialOpts: Required<Options> = {
  dllTxt: '',
  findCardRetryTimes: 1,
  debug: false,
  port: 0,
  searchAll: false,
}


export const dllFuncs: FM.DllFuncs = {
  OpenComPort: [W.INT, [W.INT, W.POINT, W.INT, W.INT] ],   // 查找设备端口
  CloseComPort: [W.INT, [] ],
  IsComOpen: [W.INT, [] ],
  GetCardNumberFromDev: [W.INT, [W.INT, W.POINT, W.INT, W.POINT] ],
  // ICCard_GetCardNumber: [W.INT, [W.INT, W.POINT, W.INT, W.INT, W.POINT] ],
  // GetCardInfoFromDev: [W.VOID, [W.POINT, W.INT, W.POINT, W.INT, W.POINT] ],
}
