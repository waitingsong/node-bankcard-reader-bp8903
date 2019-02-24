import {
  parseDeviceOpts,
  testWrite,
  validateDllFile,
  Options,
} from '@waiting/idcard-reader-base'
import { info } from '@waiting/log'
import * as ffi from 'ffi'
import {
  of,
} from 'rxjs'

import {
  dllFuncs,
} from './config'
import { disconnectDevice, findDeviceList, readAll } from './device'
import { BankCardData, Device } from './model'


export async function init(options: Options): Promise<Device[]> {
  const deviceOpts = parseDeviceOpts(options)

  const { debug } = deviceOpts

  if (debug) {
    info(deviceOpts)
  }

  await validateDllFile(deviceOpts.dllTxt)
  await testWrite(deviceOpts.imgSaveDir)
  const apib = ffi.Library(deviceOpts.dllTxt, dllFuncs)
  const devices = findDeviceList(deviceOpts, apib)

  if (devices && devices.length) {
    return devices
  }
  else {
    throw new Error('未找到读卡设备')
  }
}


/** Read card data */
export function read(device: Device): Promise<BankCardData> {
  if (device.openPort) {
    try {
      disconnectDevice(device)
    }
    catch (ex) {
      throw ex
    }

    const ret$ = of(readAll(device))
    return ret$.toPromise()
  }
  else {
    throw new Error('设备端口未指定')
  }
}
