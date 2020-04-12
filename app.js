var ref = require("@saleae/ref");
var arrayType = require("@saleae/ref-array");
const models = require("./models");
const types = require("./types");
const Silex = require("./silex");
const Values = require("./values");
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
  var bufferSize = models.SXPSERVER.size * Values.MAX_PSERVER;
  var svrPtr = ref.refType(models.SXPSERVER);
  var svrPtrArray = arrayType(svrPtr);

  console.log("bufferSize: " + bufferSize);
  var servers = new svrPtrArray(bufferSize);
  var lpbServers = Buffer.from(servers);
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

  if (returnedSize > 0) {
    for (var x = 0; x < returnedSize; x++) {
      var server = ref.get(servers.buffer, x, models.SXPSERVER); //.deref();
      console.log(
        "%s (%s / %s / %s)",
        server.szMachineType,
        szIp,
        server.szHostName,
        szMac
      );
      SXSERVERS.push(server);
      events.emit("devices", server.dwIpaddr);
    }
  }
});

events.on("devices", (dwIpaddr) => {
  var bufferSize = models.SXUSBDEVICE.size * Values.MAX_DEVICE
  var LPSXUSBDEVICE = ref.refType(models.SXUSBDEVICE);
  var LPSXUSBDEVICEArray = arrayType(LPSXUSBDEVICE);
  var devices = new LPSXUSBDEVICEArray(bufferSize);
  var lpbDevices = Buffer.from(devices);
  var lpdwReaded = ref.alloc(types.DWORD);
  var lpdwReturned = ref.alloc(types.DWORD);
  var response = Silex.SxuptpEnumDevices(
    dwIpaddr,
    lpbDevices,
    bufferSize,
    lpdwReaded,
    lpdwReturned
  );
  events.emit("trace", "devices", response, lpdwReaded, lpdwReturned);
  var returnedSize = parseInt(ref.deref(lpdwReturned).toString());
  if (returnedSize > 0) {
    var xdevices = []
    for (var x = 0; x < returnedSize; x++) {
      var device = ref.get(devices.buffer, x, models.SXUSBDEVICE);
      console.log(
        "%s (VID:%04X PID:%04X / %s)",
        device.szDeviceName,
        device.wVid,
        device.wPid,
        device.szLocation
      );
      xdevices.push(device);
    }
    SXDEVICES[dwIpaddr] = xdevices
    emit("connect", dwIpaddr)
  }
});

events.on("connect", (dwIpaddr) => {
  var server = SXSERVERS[dwIpaddr]
  var devicePtr = ref.refType(models.SXUSBDEVICE);
  var lpDevice = Buffer.from(devicePtr);
  var addr = server.bNodeaddr;
  var response = Silex.SxuptpDeviceConnectEx(dwIpaddr, addr, lpDevice, 0);
  console.log("connect -> %d", response)
  if(response == 1){
    console.log("usb info:", ref.get(addr.buffer))
  }
});

events.emit("search");
events.emit("devices", ref.NULL)
events.emit("connect", ref.NULL)
