/*
 * @Author: CKJiang 
 * @Date: 2022-08-31 19:59:54 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 22:24:00
 */


import net from "net";
import Config from './config'

export function start() {
    /* 创建TCP服务器 */
    const client = new net.Socket();

    const port = Config.get('tcpPort');
    
    /* 连接服务器 */
    client.connect(port, '127.0.0.1', function () {
        console.log("connect the server");

        /* 向服务器发送数据 */
        client.write("message from client");
    })
    
    /* 监听服务器传来的data数据 */
    client.on("data", function (data) {
        console.log("the data of server is " + data.toString());
    })

    /* 监听end事件 */
    client.on("end", function () {
        console.log("data end");
    })
}