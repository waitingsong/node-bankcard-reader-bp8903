import {
  BankCardData,
} from '@waiting/bankcard-reader-base'
import { info } from '@waiting/log'
import { dirname, setPathDirectory } from '@waiting/shared-core'

import {
  Device,
} from './model'


export function connectDevice(device: Device, port: number): number {
  if (device && device.inUse) {
    device.deviceOpts.debug && info('Cautiton: connectDevice() device in use')
    return 0
  }
  const openRet = device.apib.OpenComPort(port, Buffer.from(''), 9600, 1)
  device.deviceOpts.debug && info(`open com ret: ${openRet}`)

  return openRet === 0 ? port : 0
}

export function disconnectDevice(device: Device): boolean {
  const ret = device.apib.CloseComPort()
  device.deviceOpts.debug && info(`disconnectDevice at port: ${device.openPort}, ret: ${ret} `)
  device.inUse = false
  return true
}


/** 检查端口是否已打开 */
export function isDevicePortOpen(device: Device): boolean {
  const ret = device.apib.IsComOpen()
  device.deviceOpts.debug && info(`isPortOpen: ${ret}`)
  return ret === 1 ? true : false
}


export function findDeviceList(
  deviceOpts: Device['deviceOpts'],
  apib: Device['apib'],
): Device[] {
  const arr: Device[] = []

  // 指定了端口
  if (deviceOpts.port > 0) {
    const device = findDevice(deviceOpts.port, deviceOpts, apib)

    if (device.openPort > 0) {
      arr.push(device)
    }
  }
  else {
    // 检测串口. bp8903 为串口接口
    for (let i = 1; i <= 16; i++) {
      const device = findDevice(i, deviceOpts, apib)

      if (device.openPort > 0) {
        arr.push(device)
      }
    }
  }

  return arr
}

export function findDevice(
  openPort: Device['openPort'],
  deviceOpts: Device['deviceOpts'],
  apib: Device['apib'],
): Device {

  const device: Device = {
    apib,
    deviceOpts,
    inUse: false,
    openPort: 0,
  }

  const port = connectDevice(device, openPort)
  if (port > 0 && isDevicePortOpen(device)) {
    device.inUse = true
    device.openPort = port
    deviceOpts.debug && info(`Found device at serial/usb port: ${port}`)
    disconnectDevice(device)
  }

  return device
}


/** 读取银行卡 支持 接触、非接触、磁条 */
export function readAll(device: Device): BankCardData {
  setPathDirectory(dirname(device.deviceOpts.dllTxt))

  const buf = Buffer.alloc(64)

  if (device.deviceOpts.debug) {
    info('starting reading...')
  }
  const ret: BankCardData = {
    cardno: '',
  }

  const code = device.apib.GetCardNumberFromDev(
    device.openPort,
    // Buffer.from('124|A'),
    Buffer.from(''),
    3,
    buf,
  )

  if (code === 0) {
    // 卡号可能重复数字  ...1234557\u0000557
    ret.cardno = buf.toString().replace(/\0+.*$/, '')
  }

  if (device.deviceOpts.debug) {
    info(`readDataBase code: ${code}`)
    info(`readDataBase bufLen: ${buf.byteLength}`)
    info('readDataBase buf: ')
    info(buf)
    info(`readDataBase ret: ${ret}`)
    // info(buf.slice(80))
  }

  return ret
}
