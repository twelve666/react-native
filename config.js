
export const EVN_DEV = 'dev';
export const EVN_TEST = 'test';
export const EVN_PRO = 'pro';

//export const curEvn = EVN_DEV;
 export const curEvn = EVN_TEST;
// export const curEvn = EVN_PRO; // 生产

/* Webview主机名 */
// export const WEBVIEW_HOST_DEV = 'http://192.168.1.2:8080/';
export const WEBVIEW_HOST_DEV = 'https://koksport.nydmu.com/';
export const WEBVIEW_HOST_TEST = 'https://koksport.nydmu.com/';
export const WEBVIEW_HOST_PRO = '';

/* 接口主机名 */
// 开发
export const SERVER_HOST_DEV = 'https://nwcms.nydmu.com/';
// 测试
export const SERVER_HOST_TEST = 'https://cms.nydmu.com/';
// 生产
export const SERVER_HOST_PRO = 'https://xftiyu.com/';

// // 开发
// export const SERVER_HOST_DEV = 'http://112.121.163.125:9601/';
// // 测试
// export const SERVER_HOST_TEST = 'http://112.121.163.125:9601/';
// // 生产
// export const SERVER_HOST_PRO = '';

/* WebSocket主机名 */
// 开发
// export const WEBSOCKET_HOST_DEV = 'wss:/112.121.163.125:8888';
export const WEBSOCKET_HOST_DEV = 'ws://8888.nydmu.com/';
// export const WEBSOCKET_HOST_DEV = 'ws://103.234.96.143:8000/webSocket/sendMsgCenter';
// export const WEBSOCKET_HOST_DEV = 'ws://103.234.96.143:8000/';

// 测试
export const WEBSOCKET_HOST_TEST = 'ws://103.234.96.143:8000/';
// 生产
export const WEBSOCKET_HOST_PRO = 'wss://8888.xftiyu.com/';
// export const WEBSOCKET_HOST_PRO = 'wss://api.auauz.net/';

/**
 * 获取接口主机名
 */
export function getServerHost() {
  if (curEvn === EVN_DEV) {
    return SERVER_HOST_DEV;
  } else if (curEvn === EVN_TEST) {
    return SERVER_HOST_TEST;
  } else if (curEvn === EVN_PRO) {
    return SERVER_HOST_PRO;
  } else {
    return SERVER_HOST_PRO;
  }
}

/**
 * 外部页面地址
 */
export function getWebviewHost() {
  if (curEvn === EVN_DEV) {
    return WEBVIEW_HOST_DEV;
  } else if (curEvn === EVN_TEST) {
    return WEBVIEW_HOST_TEST;
  } else if (curEvn === EVN_PRO) {
    return WEBVIEW_HOST_PRO;
  } else {
    return WEBVIEW_HOST_PRO;
  }
}

/**
 * 获取WebSocket主机名
 */
export function getWebSocketHost() {
  if (curEvn === EVN_DEV) {
    return WEBSOCKET_HOST_DEV;
  } else if (curEvn === EVN_TEST) {
    return WEBSOCKET_HOST_TEST;
  } else if (curEvn === EVN_PRO) {
    return WEBSOCKET_HOST_PRO;
  } else {
    return WEBSOCKET_HOST_PRO;
  }
}

console.log('当前环境：', curEvn, ' 服务器地址：', getServerHost(), 'webview=', getWebviewHost(), ' websocket=', getWebSocketHost());
