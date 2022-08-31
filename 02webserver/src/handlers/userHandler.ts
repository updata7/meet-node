/*
 * @Author: CKJiang 
 * @Date: 2022-08-30 21:41:53 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 11:07:09
 */

// import userEngine from "engines/channelEngine"
import { assert, CODES, HTTP_STATUS } from "../utils/error"
import { genRandomString, genToken, random, verifyToken } from "../utils/tools"
import { Context } from "koa";
import userEngine from "../engines/userEngine";
import { CreationAttributes, Op } from 'sequelize'
import { WhereOptions } from 'sequelize/types';
import { userStatus, userStatusValue } from "../dictionary/user";
import { User } from "../models/userModel";

interface SearchBody extends BaseSearchBody {
    name: string;
    status: number;
}

class UserHandler {
    constructor() {
        this.create = this.create.bind(this);
        this.createWay1 = this.createWay1.bind(this);
    }
    // token 校验 暂没有
    async authVerifyToken(token: any): Promise<any> {
        let user_data
        try {
            const { id, account }: {
                id: string, account: string
            } = verifyToken(token)
            assert(!(id && account), HTTP_STATUS.InternalServerError, CODES.INTERNAL_SERVER_ERROR, "无效token")
            // user_data = await userEngine.findOne({ _id: id })
            // return {
            //     id: user_data.id,
            //     account: user_data.account,
            // }
        } catch (err: any) {
            assert(err.name === 'JsonWebTokenError', HTTP_STATUS.Unauthorized, CODES.TOKEN_INVALID, '检验失败')
            assert(err.name === 'TokenExpiredError', HTTP_STATUS.Unauthorized, CODES.TOKEN_EXPIRED, 'token已过期')
            throw err
        }
    }

    async insertHelper(count: number) {
        const records = new Array<CreationAttributes<User>>
        for (let i: number = 0; i < count; i++) {
            records.push({
                name: genRandomString(random(3, 12)),
                password: genRandomString(random(8, 15)),
                status: userStatusValue[random(0, userStatusValue.length-1)]
            })
        }
        await userEngine.bulkCreate(records)
    }

    // 方式一： 10万数据大概 4500 毫秒，1000万 40分钟左右
    async createWay1(count: number) {
        const total = count * 10 * 10000    // 总插入数量
        const eachMaxCount = 10000  // 一次最多插入多少数量
        let leftInsertCount = total // 剩余需要插入的数量
        const startCount = await userEngine.count()     // 插入前数据库总数
        while(true) {
            if (leftInsertCount <= 0) break
            const count = Math.min(eachMaxCount, leftInsertCount)
            await this.insertHelper(count)
            const nowCount = await userEngine.count()
            leftInsertCount = total - (nowCount - startCount)
        }
    }

    // 新建
    async create(ctx: Context) {
        const { count } = ctx.request.body
        const startTime = Math.floor(Date.now())
        await this.createWay1(count)
        ctx.body = { success: true, useTime: Math.floor(Date.now()) - startTime }
    }

    // 获取列表
    async search(ctx: Context) {
        const query: SearchBody = ctx.request.query as any

        const where: WhereOptions = {}
        if (query.name) {
            where['name'] = {
                [Op.like]: `%${query.name}%`,
            }
        }
        if (query.status) {
            where['status'] = query.status
        }

        const options: any = Object.create({
            order: [
                [
                    `${query.sortField}`, `${query.sortOrder}`
                ]
            ]
        })
        if (!query.isLoadAll) {
            options.limit = query.pageSize
            options.offset = ( query.pageNo - 1 ) * query.pageSize
        }
        console.debug('userHandler search res ==> ', query.name, where)
        const res = await userEngine.search(where, options)
        ctx.body = res
    }

    // 登录 10毫秒内
    async login(ctx: Context) {
        const { name, password } = ctx.request.body
        const startTime = Math.floor(Date.now())
        const where: WhereOptions = { name }
        const user = await userEngine.findOne(where)
        if (!user) {
            ctx.body = {
                success: false,
                message: `用户${name}不存在`
            }
            return
        }
        if (user.password !== password) {
            ctx.body = {
                success: false,
                message: `密码错误，请检查大小写是否输入有误`
            }
            return
        }
        if (user.status !== userStatus.ENABLE) {
            ctx.body = {
                success: false,
                message: '该用户已被禁用'
            }
            return
        }

        ctx.body = { success: true, useTime: Math.floor(Date.now()) - startTime }
    }

    // 删除
    async delete(ctx: Context) {
        const { ids } = ctx.request.body
        console.debug('user delete ==> ', ids)
        await userEngine.delete(ids)
        ctx.body = { success: true }
    }

    // 更新
    async update(ctx: Context) {
        const { id, name, password, status } = ctx.request.body as User
        await userEngine.updateById(id, { name, password, status })
        ctx.body = { success: true }
    }
}

export default new UserHandler();