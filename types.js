var ref = require("@saleae/ref");
var arrayType = require("@saleae/ref-array");
var types = {
  BOOL: ref.types.int,
  REGSAM: ref.types.ulong,
  WORD: ref.types.short,
  DWORD: ref.types.uint32,
  LONG: ref.types.long,
  ULONG: ref.types.ulong,
  ULONG_PTR: ref.types.ulong,
  HWND: ref.refType(ref.types.void),
  BYTE: ref.types.uint8,
  HKEY: ref.refType(ref.types.void),
  PVOID: ref.refType("pointer"),
  HANDLE: ref.refType(ref.types.void),
  HINSTANCE: ref.refType(ref.types.void),
  HKL: "void*",
  LPSTR: arrayType(ref.types.char),
  LPCTSTR: ref.refType(ref.types.CString),
  STRING: ref.types.CString,
  INT: ref.types.int,
  TCHAR: ref.types.uint16,
  UINT: ref.types.uint,
  LPVOID: ref.refType(ref.types.void),
};

types.PHKEY = ref.refType(types.HKEY);
types.LPBYTE = ref.refType(types.BYTE);
types.LPDWORD = ref.refType(types.DWORD);
module.exports = types;
