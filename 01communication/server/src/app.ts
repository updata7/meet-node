/*
 * @Author: CKJiang 
 * @Date: 2022-08-31 19:59:54 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-09-01 00:31:59
 */


import net from "net";
import Config from './config'
import { encode as msgpack_pack, decode as msgpack_unpack } from "@msgpack/msgpack";

function packMsg(msg: string): Buffer {
    // 包头2位
    const head = Buffer.from([parseInt('47', 16), parseInt('47', 16)]);
    
    // 1位命令号
    const cmdNumber = Buffer.alloc(1);
    cmdNumber.writeUInt8(parseInt('1', 16));
    
    // 包尾2位
    const tail = Buffer.from([parseInt('47', 16), parseInt('47', 16)]);
    
    const msgBuffer = msgpack_pack(msg)
    
    // 数据长度1位
    const msgLength = Buffer.alloc(1);
    // 长度的数值为 msgBuffer的长度+头尾共4个字节+命令号1个字节+自己1个字节
    msgLength.writeUInt8(parseInt((Buffer.byteLength(msgBuffer)+6).toString(), 16));
    const finalBuffer = Buffer.concat([head, cmdNumber, msgLength, msgBuffer, tail]);
    console.log('===>>> ', finalBuffer, msgBuffer, parseInt(`${Buffer.byteLength(msgBuffer)}`, 16), msg);
    return finalBuffer
}

function unpackMsg(buffer: Buffer): string {
    const head = Buffer.alloc(2)
    buffer.copy(head, 0, 0, 2)
    console.log('===>>> ', head, head[0], head[1])
    return head.toString()
}
export function start() {
    const num = 10
    unpackMsg(packMsg(num.toString(16)))

    /* 创建TCP服务器 */
    const server = net.createServer(function(socket){
        console.log('someone connects ===>>', socket.address());
        var address = server.address();
        var message = "the server address is"+JSON.stringify(address);

        /* 发送数据 */
        socket.write(message,function(){
            var writeSize = socket.bytesWritten;
            console.log(message + "has send");
            console.log("the size of message is"+writeSize);
        })

        /* 监听data事件 */
        socket.on('data',function(data){
            console.log(data.toString());
            var readSize = socket.bytesRead;
            console.log("the size of data is"+readSize);
        })
    })

    const port = Config.get('tcpPort');
    /* 设置连接的服务器 */
    server.listen(port, function(){
        console.log(`tcp server runnning on http://127.0.0.1:${port}/`);
    })
    
}