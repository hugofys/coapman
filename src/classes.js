export class CoapRequest {
  constructor() {
    this.method = "get";
    this.url = "";
    this.headerArray = [];
    this.body;
  }
  getHeadersObj(headerArray) {
    if (!headerArray) {
      return null;
    }
    let obj = {};
    headerArray.forEach(header => {
      if (header.key && header.value) {
        obj[header.key] = header.value;
      }
    });
    return obj;
  }
}