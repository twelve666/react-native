import { getWebSocketHost } from '../../config';

export default class MyWebSocket {
  socket = null;
  options = null;
  lockReconnect = false;// 避免重复连接
  tt = null;
  url = null;
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    // console.log('info WebSocket constructor options ', options);
    this.url = getWebSocketHost() + (this.options.url || '');
    let defaultOptions = {
      tryConnectCount: 3,
      tryConnectIntervalTime: 3000
    };
    this.createWebSocket();
  }
  createWebSocket() {
    try {
      this.socket = new WebSocket(this.url);
      this.init();
    } catch (e) {
      console.log('catch');
    }
  }
  reconnect(url) {
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;
    this.tt && clearTimeout(this.tt);
    this.tt = setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
      // console.log('关闭后重连');
    });
  }
  init() {
    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onclose = this.onclose;
    this.socket.onerror = this.onerror;
  }
  onopen = (event) => {
    console.log(this.options.name + ': Socket onopen');
    this.options?.onopen && this.options?.onopen(event);
    this.heartCheck.start();
  }
  onmessage = (event) => {
    try {
      // console.log(this.options.name + ' on message data = ', event?.data)
      if ('连接成功' === event.data) return;
      this.options?.onmessage && this.options?.onmessage(JSON.parse(event?.data || '{}'));
    } catch (e) {
      // console.log(this.options.name + ': onmessage data err ', e);
    } finally {
      // console.log('接收到消息', JSON.parse(event?.data || '{}'));
      // TODO
    }
  }
  send(msg) {
    this.socket?.send(msg);
  }
  onerror = (event) => {
    // console.log(this.options.name + ': onerror tryConnectCount=', this.options.tryConnectCount, this.socket?.readyState);
    // if (this.socket?.readyState === 2 || this.socket?.readyState === 3 && this.options.tryConnectCount > 0) {
    //   this.st = setTimeout(() => {
    //     // console.log('setTimeout=', this.options.tryConnectCount, this.socket?.readyState)
    //     this.options.tryConnectCount--;
    //     clearTimeout(this.st);
    //     this.createWebSocket();
    //     console.log('原来的超时逻辑');
    //   }, this.options.tryConnectIntervalTime);
    // }
    this.options?.onerror && this.options?.onerror(event);
    // console.log('发生异常了');
    this.reconnect(this.url);
  }
  close() {
    this.socket?.close && this.socket?.close();
  }
  onclose = (event) => {
    // console.log(this.options.name + ': Socket onclosed');
    this.options?.onclose && this.options?.onclose(event);
    // console.log('链接关闭');
    this.reconnect(this.url);
  }
  // 心跳检测
  heartCheck = {
    mSelf: this,
    timeout: 5000,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function () {
      let self = this;
      this.timeoutObj && clearInterval(this.timeoutObj);
      // this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setInterval(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，

        let timestamp = (new Date()).getTime();
        // ,"beatTime":timestamp
        let obj = 'ping';
        let a = JSON.stringify(obj);
        if (self.mSelf.socket.readyState === WebSocket.OPEN) {
          self.mSelf.socket.send(a);
          console.log('心跳');
        }
        // self.serverTimeoutObj = setTimeout(function () {
        //   self.mSelf.socket.close();
        //   console.log('主动断掉');
        // }, self.timeout);
      }, this.timeout);
    }
  }
}
