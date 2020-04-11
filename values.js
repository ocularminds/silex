const Values = {
  MAX_PSERVER: 16,
  MAX_DEVICE: 64,

  STATUS_AVAILABLE: 1,
  STATUS_CONNECTED: 2,
  STATUS_INUSE: 3,
  STATUS_NOTFOUND: 4,
  SXUPTP_MACHINE: 6,
  SXUPTP_PORT: 32,
  SXUPTP_DEVICE: 64,
  SXUPTP_LOCATION: 16,
  SXUPTP_HOSTNAME: 16,
  SXUPTP_PASSWORD: 16,

  SRU_NOTIFY: 800, //(WM_APP + 800),
  SRU_REQUEST: 0x0001,
  SRU_CANCEL: 0x0002,
  SRU_ACCEPT: 0x0003,
  SRU_REFUSE: 0x0004,
  SRU_DISCONNECT: 0x0005,
  SRU_BUSY: 0x0006,
  SRU_REPLY: 0x0007,
  SRU_NOTFOUND: 0x0008,
  SRU_REPLYEX: 0x0009,
  SRU_DISCONTIME: 0x000b,
  SRU_CONFIRM: 0xfffe,
  SRU_TIMEOUT: 0xffff,
};
module.exports = Values;
