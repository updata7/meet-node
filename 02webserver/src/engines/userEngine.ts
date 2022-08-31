import { User } from 'models/userModel';
import { CreationAttributes, IntegerDataTypeConstructor, WhereOptions } from 'sequelize/types';
import sequelize from '../models'

class UserEngine {
    user = sequelize.models.user;
    /**
     * 获取列表
     */
    async search(w: WhereOptions, options: Object): Promise<any> {
        const { count, rows } = await this.user.findAndCountAll({where: w, ...options});
        return { rows, count };
    }

    async findOne(w: WhereOptions): Promise<any> {
        const user = await this.user.findOne({where: w});
        return user;
    }

    /**
     * 统计数量
     * @param w 查询条件
     */
    async count(w ?: WhereOptions): Promise<number> {
        const count = await this.user.count({ where: w })
        return count;
    }

    /**
     * 通过id更新数据
     * @param id 主键id
     * @param update 新数据
     */
    async updateById(id: IntegerDataTypeConstructor, update: any) {
        console.debug("userEngine updateById ==> ", id, update);
        await sequelize.models.user.update(update, {
            where: {
                id
            }
        })
    }

    /**
     * 批量创建数据
     * @param records 
     */
    async bulkCreate(records: Array<CreationAttributes<User>>) {
        await sequelize.models.user.bulkCreate(records, {
            ignoreDuplicates: true  // ignore duplicate
        })
    }

    /**
     * 删除数据
     * @param ids id数组
     */
    async delete(ids: Array<number>) {
        await sequelize.models.user.destroy({
            where: {
                id: ids
            }
        })
    }

    // 创建
    async create(user: CreationAttributes<User>): Promise<any> {
        const res = await sequelize.models.user.create(user)
        return res
    }
}

export default new UserEngine();