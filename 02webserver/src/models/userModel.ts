/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 19:00:28 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 00:32:52
 */

import { userStatus } from '../dictionary/user';
import { DataTypes, Sequelize, Model } from 'sequelize'
import { BaseModelStatic, BaseModel } from './base';

export interface User extends BaseModel, Model {
    id: typeof DataTypes.INTEGER;
    name: typeof DataTypes.STRING;
    password: typeof DataTypes.STRING;
    status: typeof DataTypes.INTEGER; 	// 0 for 
}

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default(sequelize: Sequelize) => {
	const UserModel = sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				// We require usernames to have length of at least 3, and
				// only use letters, numbers and underscores.
				is: /^\w{3,}$/
			},
            comment: "user name, 用户名"
		},
        password: {
			allowNull: false,
			type: DataTypes.STRING,
            comment: "user password, 密码"
		},
        status: {
            allowNull: false,
            type: DataTypes.INTEGER,
			validate: {
				isIn: {
					args: [[userStatus.DISABLE, userStatus.ENABLE]],
					msg: `状态指必须为${JSON.stringify(userStatus)}里的值`
				}
			},
            comment: "user status, 状态"
        },
	}, {
        // open timestamps
        timestamps: true,
        // dont use updatedAt
        updatedAt: false,
		indexes: [
			// 在 name 上创建唯一索引
			{
			  unique: true,
			  fields: ['name']
			},
			{
				fields: ['name', 'status'],
				where: {
					status: userStatus.ENABLE
				}
			},
		]
    }) as BaseModelStatic<User>;
    return UserModel;
};
