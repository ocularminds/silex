var ffi = require("@saleae/ffi");
var ref = require("@saleae/ref");
var types = require("./types");
const models = require("./models");

var LPSXUSBDEVICE = ref.refType(models.SXUSBDEVICE);
var LPSXDEVINST = ref.refType(models.SXDEVINST);

const Silex = new ffi.Library("Sxuptp", {
  SxuptpEnumDeviceServers: [
    "int",
    [types.LPDWORD, "int", types.LPVOID, "int", types.LPDWORD, types.LPDWORD],
  ],
  SxuptpEnumDevices: [
    "int",
    ["int", types.LPVOID, "int", types.LPDWORD, types.LPDWORD],
  ],
  SxuptpDeviceConnect: ["int", ["int", types.LPBYTE, types.LPSTR, "int"]],
  SxuptpDeviceConnectEx: ["int", ["int", types.LPBYTE, LPSXUSBDEVICE, "int"]],
  SxuptpDeviceConnectEx2: [
    "int",
    ["int", types.LPBYTE, LPSXUSBDEVICE, "int", types.LPVOID],
  ],/*
  SxuptpDeviceDisconnect: ["int", ["int", types.LPBYTE, types.LPSTR]],
  SxuptpDeviceDisconnectEx: ["int", ["int", types.LPBYTE, LPSXUSBDEVICE]],
  SxuptpGetDeviceServerInfo: ["int", ["int", types.LPVOID, "int"]],
  SxuptpGetDeviceStatus: ["int", ["int", types.LPSTR]],
  SxuptpGetSystemStatus: ["int", ["int", types.LPSTR, "int"]],
  SxuptpSetSrchRuleCookie: ["int", [types.WORD]],
  SxuptpRebootDeviceServer: ["int", ["int", types.LPBYTE]],

  SruInitialize: ["int", [types.HINSTANCE, types.HWND, types.LPCSTR]],
  SruUninitialize: ["int", [types.HINSTANCE]],
  SruSendRequest: [
    "int",
    [types.HANDLE, "int", types.LPBYTE, LPSXUSBDEVICE, "int"],
  ],
  SruCancelRequest: ["int", [types.HANDLE]],
  SruCloseHandle: ["int", [types.HANDLE]],
  SruSendReply: ["int", ["byte", "int"]],
  SruAcceptRequest: ["int", []],
  SruRefuseRequest: ["int", []],
  SruDisconnectedDevice: ["int", []],
  SruDeviceNotFound: ["int", []],
  SxuptpGetInstanceId: ["int", ["int", types.LPCSTR, LPSXDEVINST]],
  SxuptpFreeInstanceId: ["int", [LPSXDEVINST]],*/
});

module.exports = Silex;
