var ref = require('@saleae/ref');
var arrayType = require("@saleae/ref-array");
const models = require("./models");
const types = require("./types");
const Silex = require("./silex");
const Values = require("./values");
const EventEmitter = require("events");

var events = new EventEmitter();
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
  //console.log("input num: "+process.argv[2])
  var dwCount = 0//parseInt(process.argv[2]);
  var ips = [];//ref.sizeof.pointer
  var bufferSize =  models.SXPSERVER.size * Values.MAX_PSERVER
  var svrPtr = ref.refType(models.SXPSERVER)
  var svrPtrArray = arrayType(svrPtr)

  console.log("bufferSize: "+bufferSize)
  var svrs = new svrPtrArray(bufferSize);
  var lpbServers = Buffer.from(svrs)
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
  console.log("SxuptpEnumDeviceServers -> " + response);
  console.log("total bytes -> " + ref.deref(lpdwReaded).toString());
  console.log("servers found -> " + ref.deref(lpdwReturned).toString());
});

events.emit("search");
