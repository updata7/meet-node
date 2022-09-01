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
    const codes = [0x47, 0x47]
    // 包头2位
    const head = Buffer.from(codes);
    
    // 1位命令号
    const cmdNumber = Buffer.alloc(1);
    cmdNumber.writeUInt8(0x02);
    
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

    return { content: content2 }
}

export function start() {
    // 创建TCP服务器
    const server = net.createServer(function(socket){
        console.log('someone connects ===>>', socket.address());
        // 10秒内没通信则断开连接
        socket.setTimeout(10000);
        socket.on('timeout', () => {
            console.log('client timeout');
            socket.end();
        });

        let counter: number = 0;
        // 监听data事件
        socket.on('data', function(data) {
            try {
                const res = unpackMsg(data)
                socket.write(packMsg((parseInt(res.content, 16)+0x1).toString(16)))
                console.log(`第${++counter}次 收到: ${res.content} 发送：${(parseInt(res.content, 16)+0x1).toString(16)}`)
            } catch (e) {
                console.error('捕捉到错误 ==> ', e)
                // socket.write('数据格式输入有误')
            }
        })

        socket.on('error',(err)=>{
            console.log("client error ==> ", err);
        });
    })

    const tcpConfig = Config.get('tcp');
    // 设置连接的服务器
    server.listen(tcpConfig.port, function(){
        console.log(`tcp server runnning on http://${tcpConfig.host}:${tcpConfig.port}/`);
    })
    
    server.on('error', (e: any) => {
        // 端口被占用，自动断开重启
        if (e.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(() => {
                server.close();
                server.listen(tcpConfig.port, tcpConfig.host);
            }, 1000);
        }
        console.error('error ==> ', e)
        throw e
    });
}