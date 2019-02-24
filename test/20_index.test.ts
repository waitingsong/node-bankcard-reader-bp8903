/// <reference types="mocha" />

import { basename } from 'path'
import * as assert from 'power-assert'

import * as bcr from '../src/index'
import { BankCardData, Options } from '../src/lib/model'


const filename = basename(__filename)

describe(filename, () => {

  it('Should read() works', async () => {
    const opts: Options = {
      dllTxt: 'd:/idcard-drv/MantianRead.dll',
      debug: false,
    }

    try {
      const devices = await bcr.init(opts)

      if (! devices.length) {
        assert(false, 'No device found')
        return
      }
      const ret: BankCardData = await bcr.read(devices[0])

      console.info(ret)
      assert(!! ret, 'Result Data invalid')
      assert(ret && ret.cardno, 'cardno of BankCardData empty')
    }
    catch (ex) {
      assert(false, ex)
    }
  })
})
