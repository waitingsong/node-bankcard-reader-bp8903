import {
  DTypes as W,
  FModel as FM,
} from 'win32-def'

import {
  Config,
} from './model'


export {
  initialOpts,
} from '@waiting/bankcard-reader-base'

export const config: Config = {
  appDir: '',  // update by entry point index.js
}

export const dllFuncs: FM.DllFuncs = {
  OpenComPort: [W.INT, [W.INT, W.POINT, W.INT, W.INT] ],   // 查找设备端口
  CloseComPort: [W.INT, [] ],
  IsComOpen: [W.INT, [] ],
  GetCardNumberFromDev: [W.INT, [W.INT, W.POINT, W.INT, W.POINT] ],
  // ICCard_GetCardNumber: [W.INT, [W.INT, W.POINT, W.INT, W.INT, W.POINT] ],
  // GetCardInfoFromDev: [W.VOID, [W.POINT, W.INT, W.POINT, W.INT, W.POINT] ],
}
