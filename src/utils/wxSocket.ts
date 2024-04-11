import { getStore, USER_INFO } from '@/utils/index';
interface Opts {
  url?: string;
  ping?: number;
  onMsg?: (o: any) => void;
  onClose?: (o: any) => void;
  onOpen?: () => void;
  onErr?: (o: any) => void;
  pingMsg?: string;
  pongTimeout?: number;
  reconnectTimeout?: number;
  repeatLimit?: number;
}
const dev = 'wss://appdev-api.newrizon.cloud:8188/ws/vInfo';
const prod = 'wss://app-api.newrizon.cloud/ws/vInfo';
const local = 'ws://localhost:8282';
const baseUrl = `${process.env.NODE_ENV === 'development' ? prod : prod}`;

function regUrl() {
  const user = getStore(USER_INFO);
  return `${baseUrl}?memberId=${user.member_id}`;
}

export class Socket {
  socketTask: any;
  opts: Opts;
  forbidReconnect = false;
  pingTimeoutId: any;
  pongTimeoutId: any;
  lockReconnect = false;
  repeat = 0;

  defaultOpts = {
    repeatLimit: 10,
    reconnectTimeout: 5000,
    ping: 10000,
    pongTimeout: 15000,
    pingMsg: 'heartbeat',
    url: regUrl(),
  };

  constructor(opts: Opts) {
    this.opts = { ...this.defaultOpts, ...opts };
    this.createSocket();
  }
  init() {
    this.registerHeartBeatEvent();
  }

  createSocket() {
    console.log('create======');
    this.forbidReconnect = false;
    this.socketTask = my.connectSocket({
      url: this.opts.url!,
      header: {
        'content-type': 'application/json',
      },
      success() {
        console.log('WebSocket success======');
      },
      fail() {
        console.log('WebSocket fail======');
      },
    });

    this.init();
  }

  registerHeartBeatEvent() {
    this.socketTask.onOpen(() => {
      console.log('WebSocket open======');
      this._onOpen();
    });

    this.socketTask.onClose((ret) => {
      this.onClose(ret);
    });

    this.socketTask.onMessage((res) => {
      this.onMsg(res);
    });

    this.socketTask.onError((err) => {
      this.onErr(err);
    });
  }

  sendMsg(data) {
    this.socketTask.send({
      data,
      success(res) {
        console.log('WebSocket 发送测试信息成功===', data, res);
      },
      fail: (err) => {
        console.log('WebSocket 发送测试信息失败===', data, err);
      },
    });
  }
  onErr(err) {
    console.log('WebSocket err=======', err);
    this.opts.onErr?.(err);
    this.reconnect();
  }
  onMsg(msg) {
    console.log('接收到的服务器消息', msg);
    this.opts.onMsg?.(msg);
    this.heartCheck();
  }
  _onOpen() {
    this.repeat = 0;
    this.opts.onOpen?.();
    this.heartCheck();
  }
  onClose(ret) {
    console.log('断开 WebSocket 连接', ret);
    this.opts.onClose?.(ret);
    this.reconnect();
  }
  reconnect() {
    if (this.opts.repeatLimit! > 0 && this.opts.repeatLimit! <= this.repeat)
      return; //limit repeat the number
    if (this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++; //必须在lockReconnect之后，避免进行无效计数
    //没连接上会一直重连，设置延迟避免请求过多
    console.log('WebSocket reconnect =====');
    setTimeout(() => {
      this.createSocket();
      this.lockReconnect = false;
    }, this.opts.reconnectTimeout);
  }

  close() {
    this.forbidReconnect = true;
    this.heartReset();
    this.socketTask.close();
  }
  heartCheck() {
    this.heartReset();
    this.heartStart();
  }
  heartReset() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  }
  heartStart() {
    if (this.forbidReconnect) return; //不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      this.sendMsg(this.opts.pingMsg);
      this.heartStart();
      this.pongTimeoutId = setTimeout(() => {
        //如果onClose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onClose导致重连两次
        this.close();
      }, this.opts.pongTimeout);
    }, this.opts.ping);
  }
}
