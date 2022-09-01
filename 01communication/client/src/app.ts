/*
 * @Author: CKJiang 
 * @Date: 2022-08-31 19:59:54 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 22:24:00
 */


import net from "net";
import Config from './config'
import { encode as msgpack_pack, decode as msgpack_unpack } from "@msgpack/msgpack";
import { random } from "./utils/tools";

// 解包
function unpackMsg(buffer: Buffer): any {
    // 包头
    const head = Buffer.alloc(2)
    buffer.copy(head, 0, 0, 2)

    // 命令号
    const cmdNumber = Buffer.alloc(1)
    buffer.copy(cmdNumber, 0, 2, 3)
    
    // 数据长度
    const msgLength = Buffer.alloc(1)
    buffer.copy(msgLength, 0, 3, 4)

    // 数据内容
    const content = Buffer.alloc(parseInt(msgLength.toString('hex'), 16))
    buffer.copy(content, 0, 4, 4+content.byteLength)
    const content2: any = msgpack_unpack(content)
    // 包尾
    const tail = Buffer.alloc(2)
    buffer.copy(tail, 0, buffer.byteLength-2, buffer.byteLength)

    
    // console.log('===>>> ', head, cmdNumber, msgLength, content, tail, content2)

    return { cmdNumber: cmdNumber.toString('hex'), content: content2.toString('hex') }
}

function packMsg(msg: string): Buffer {
    const codes = [0x47, 0x47]
    // 包头2位
    const head = Buffer.from(codes);
    
    // 1位命令号
    const cmdNumber = Buffer.alloc(1);
    cmdNumber.writeUInt8(0x01);
    
    // 包尾2位
    const tail = Buffer.from(codes);
    
    const msgBuffer = msgpack_pack(msg)
    
    // 数据长度1位
    const msgLength = Buffer.alloc(1);
    // 长度的数值为 msgBuffer的长度
    msgLength.writeUInt8(parseInt(Buffer.byteLength(msgBuffer).toString(), 16));
    const finalBuffer = Buffer.concat([head, cmdNumber, msgLength, msgBuffer, tail]);
    // console.log('===>>> ', finalBuffer, msgBuffer, parseInt(`${Buffer.byteLength(msgBuffer)}`, 16), msg);
    return finalBuffer
}

let content: number = 0;     // 给服务器发送的数据
let counter: number = 0; // 计数器

function getSendContent(): Buffer {
    content = random(1, 10000)
    return packMsg(content.toString(16))
}

// 校验服务器发过来的内容
function checkContent(msgFromServer: Buffer): boolean {
    const res = unpackMsg(msgFromServer)
    // console.debug('===>>> ', res)
    if (res.cmdNumber !== '02') {
        console.log(`命令号不对 ${res.cmdNumber}`)
        return false
    }

    if (res.content !== (content+1).toString(16)) {
        console.log(`数据校验不成功 ${res.content} ${(content+1).toString(16)}`)
        return false
    }

    return true
}

export function start() {
    // 创建TCP服务器
    const client = new net.Socket();

    const tcpConfig = Config.get('tcp');

    // 连接服务器
    client.connect(tcpConfig.port, tcpConfig.host)

    // // 10秒后断开连接
    // client.setTimeout(1000);

    // client.on('timeout', () => {
    //     console.log('client timeout');
    //     client.end();
    // });

    // 监听end事件
    client.on("end", function () {
        console.log("client is end");
    })

    client.on('connect', function() {
        console.log("connect the server successfully");
        const buffer = getSendContent()
        client.write(buffer, function() {
            console.debug(`第${++counter}次发送数据: ${content}, buffer: ${buffer}`)
        })
    })

    // 监听服务器传来的data数据
    client.on("data", function (data) {
        console.debug(`receive from server ${data}`)
        const success = checkContent(data)
        if (!success) {
            client.end()
            return
        }
        const buffer = getSendContent()
        client.write(buffer, function() {
            console.debug(`第${++counter}次发送数据成功: ${content}, buffer: ${buffer}`);
        })
    })
    setTimeout(() => {
        console.log('已经运行10秒了，自动停止')
        process.exit(1)
    }, 10000);
}