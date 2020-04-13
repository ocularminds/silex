var ref = require("@saleae/ref");
var arrayType = require("@saleae/ref-array");
const ipaddr = require("ipaddr.js");
const models = require("./models");
const types = require("./types");
const Silex = require("./silex");
const Values = require("./values");
const commons = require("./commons");

const EventEmitter = require("events");

var events = new EventEmitter();
var SXSERVERS = {};
var SXDEVICES = {};

events.on("trace", (action, res, data, count) => {
  console.log(action + " -> " + res);
  console.log("total bytes -> " + ref.deref(data).toString());
  console.log("records found -> " + ref.deref(count).toString());
});
/*
LPDWORD ips, * Array address of broadcast address
DWORD dwCount,  Number of broadcast addresses 
LPVOID lpbServers,  Array address of the structure 
DWORD cbBuf,  Number of bytes of array 
LPDWORD lpdwReaded,  Parameter’s address to which the number of byte copied
will be returned
LPDWORD lpdwReturned /* Parameter’s address to which the number of structure
copied will be returned*/
events.on("search", () => {
  var dwCount = 0;
  var sSize = models.SXPSERVER.size;
  var bufferSize = sSize * Values.MAX_PSERVER;
  var ServerPointerArray = arrayType(types.LPVOID);
  var SxpServerArray = arrayType(models.SXPSERVER);

  console.log("bufferSize: " + bufferSize);
  var servers = new ServerPointerArray(bufferSize);
  var lpbServers = ref.alloc(types.LPVOID, ref.NULL); //ref.alloc(ServerPointerArray, servers);
  var lpdwReaded = ref.alloc(types.DWORD);
  var lpdwReturned = ref.alloc(types.DWORD);

  var response = Silex.SxuptpEnumDeviceServers(
    ref.NULL,
    dwCount,
    lpbServers,
    bufferSize,
    lpdwReaded,
    lpdwReturned
  );

  events.emit("trace", "Servers", response, lpdwReaded, lpdwReturned);
  var returnedSize = parseInt(ref.deref(lpdwReturned).toString());
  var servers = ref.reinterpret(lpbServers, returnedSize * sSize, 0);
  console.log("\n"+servers);
  console.log(servers.length);
  if (returnedSize > 0) {
    console.log("returned object size: %d", returnedSize * sSize);
    let S = new SxpServerArray(servers)
    console.log("buffer -> "+S.buffer)
    for (var x = 0; x < returnedSize; x++) {
      var server = ref.get(S.buffer, x * sSize, models.SXPSERVER);
      var szIp = commons.int2ip(server.dwIp);
      var m = server.bNodeaddr;
      var szMac = m[0].toString(16) + ":" + m[1].toString(16);
      szMac += m[2].toString(16) + ":" + m[3].toString(16);
      szMac += m[4].toString(16) + ":" + m[5].toString(16);
      console.log(
        "%s (%s / %s / %s)",
        Buffer.from(server.szMachineType).toString('utf-8'),
        szIp,
        Buffer.from(server.szHostName).toString('utf-8'),
        szMac
      );
      SXSERVERS[server.dwIp] = server.dwIp;
      events.emit("devices", server.dwIpaddr);
    }
  }
});

events.on("devices", (dwIpaddr) => {
  var dSize = models.SXUSBDEVICE.size;
  var bufferSize = dSize * Values.MAX_DEVICE;
  var DevicePointer = ref.refType(models.SXUSBDEVICE);
  var DevicePointerArray = arrayType(DevicePointer);
  var devices = new DevicePointerArray(bufferSize);
  var lpbDevices = ref.alloc(types.LPVOID); //DevicePointerArray, devices);
  var lpdwReaded = ref.alloc(types.DWORD);
  var lpdwReturned = ref.alloc(types.DWORD);
  try {
    var response = Silex.SxuptpEnumDevices(
      dwIpaddr,
      lpbDevices,
      bufferSize,
      lpdwReaded,
      lpdwReturned
    );
  } catch (error) {
    console.log(error);
  }
  events.emit("trace", "devices", response, lpdwReaded, lpdwReturned);
  var returnedSize = parseInt(ref.deref(lpdwReturned).toString());
  if (returnedSize > 0) {
    var xdevices = [];
    var devices = ref.reinterpret(lpbDevices, returnedSize * dSize, 0);
    console.log(devices)
    var SxUSBDeviceArray = arrayType(commons.SXUSBDEVICE)
    let D = new SxUSBDeviceArray(devices)
    for (var x = 0; x < returnedSize; x++) {
      var device = ref.get(D.buffer, x * dSize, models.SXUSBDEVICE);
      console.log(
        "%s (VID:%04X PID:%04X / %s)",
        device.szDeviceName,
        device.wVid,
        device.wPid,
        device.szLocation
      );
      xdevices.push(device);
    }
    SXDEVICES[dwIpaddr] = xdevices;
    emit("connect", dwIpaddr);
  }
});

events.on("connect", (dwIpaddr) => {
  var server = SXSERVERS[dwIpaddr];
  var LPSXUSBDEVICE = ref.refType(models.SXUSBDEVICE);
  var lpDevice = ref.alloc(LPSXUSBDEVICE);
  var addr = server.bNodeaddr;
  var response = Silex.SxuptpDeviceConnectEx(dwIpaddr, addr, lpDevice, 0);
  console.log("connect -> %d", response);
  if (response == 1) {
    var device = ref.get(lpDevice.buffer).deref();
    console.log("usb info:", JSON.stringify(device));
  }
});

events.emit("search");
