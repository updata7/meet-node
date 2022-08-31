/*
 * @Author: CKJiang 
 * @Date: 2022-08-30 21:57:45 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 17:08:34
 */

import Config from '../config'
import { Sequelize } from 'sequelize';

const mysqlConfig = Config.get('mysql')
const sequelize = new Sequelize(mysqlConfig.dbname, mysqlConfig.user, mysqlConfig.password, {
    host: mysqlConfig.host,
    dialect: 'mysql',
    pool: {
        max: 5, // 连接池最大链接数量
        min: 0, // 最小连接数量
        idle: 10000, // 如果一个线程10秒内没有被使用的话，就释放连接池
    },
    logging: false,
    // 显示所有日志函数调用参数 Show all log function call parameters
    // logging: (...msg) => console.log(msg)
})

const modelDefiners = [
	require('./userModel').default,
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We export the sequelize connection instance to be used around our app.
export default sequelize;