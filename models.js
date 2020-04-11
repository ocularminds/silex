const types = require("./types");
const Values = require("./values");
var Struct = require("@saleae/ref-struct");
var arrayType = require("@saleae/ref-array");

const models = {
  SXPSERVER: Struct({
    bNodeaddr: arrayType(types.BYTE, 6),
    dwIp: types.DWORD,
    szMachineType: arrayType('char', Values.SXUPTP_MACHINE),
    szHostName: arrayType('char', Values.SXUPTP_HOSTNAME),
  }),
  SXUSBDEVICE: Struct({
    szPortName: arrayType('char', Values.SXUPTP_PORT),
    szDeviceName: arrayType('char', Values.SXUPTP_DEVICE),
    dwIpPc: types.DWORD,
    wStatus: types.DWORD,
    wVid: types.DWORD,
    wPid: types.DWORD,
    szLocation: arrayType('char', Values.SXUPTP_LOCATION),
    wClass: types.DWORD,
  }),
  SRUINFO: Struct({
    dwSize: types.DWORD,
    wMessage: types.DWORD,
    szMyName: arrayType('char', 64),
    szDestName: arrayType('char', 64),
    dwSrvIp: types.DWORD,
    bNodeaddr: arrayType(types.BYTE, 6),
    wVid: types.DWORD,
    wPid: types.DWORD,
    szDeviceName: arrayType('char', Values.SXUPTP_DEVICE),
    szLocation: arrayType('char', 16),
    dwRemainingTime: types.DWORD,
  }),
  SXDEVINST: Struct({ lpszInstanceId: types.LPCTSTR }),
};

module.exports = models;
