/*
 * @Author: CKJiang 
 * @Date: 2022-08-30 21:38:04 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 11:04:21
 */

import { userStatusValue } from '../dictionary/user'
import Joi from 'joi'
import userHandler from '../handlers/userHandler'
import { mongoIdSchema, cudResultSchema, pagingSchema } from './schema'
export default [
    {
        meta: {
            swagger: {
                summary: 'new record 新建记录',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/create',
        method: 'POST',
        validate: {
            body: Joi.object({
                count: Joi.number().required().default(1).description('创建多少个用户，单位 10万'),
            }),
            output: {
                success: Joi.boolean().required().description('是否成功').example(true),
                useTime: Joi.number().when('success', {
                    is: true,
                    then: Joi.required().description('单位毫秒, 当 success 为 true 时 useTime 比填, false 时 useTime 为必填').example('5000'),
                    otherwise: Joi.optional()
                }),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.create
    },
    {
        meta: {
            swagger: {
                summary: 'login 登录',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/login',
        method: 'POST',
        validate: {
            body: Joi.object({
                name: Joi.string().trim().required().description('用户名'),
                password: Joi.string().required().min(6).max(100).description('密钥必填'),
            }),
            output: {
                success: Joi.boolean().required().description('是否成功').example(true),
                useTime: Joi.number().when('success', {
                    is: true,
                    then: Joi.required().description('单位毫秒, 当 success 为 true 时 useTime 比填, false 时 useTime 为必填').example('5000'),
                    otherwise: Joi.optional()
                }),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.login
    },
    {
        meta: {
            swagger: {
                summary: 'get user record',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/search',
        method: 'GET',
        // auth: true,
        validate: {
            query: Joi.object({
                name: Joi.string().trim().description('user name'),
                status: Joi.number().valid(userStatusValue).description('用户 状态')
            }).keys(pagingSchema.request),
            output: {
                rows: Joi.array().description('list'),
                count: Joi.number().description('total count')
            }
        },
        handler: userHandler.search
    },
    {
        meta: {
            swagger: {
                summary: 'update data',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/update',
        method: 'POST',
        validate: {
            body: Joi.object({
                id: Joi.number().required().description("user id"),
                name: Joi.string().trim().required().description('用户名'),
                password: Joi.string().required().min(6).max(100).description('密钥必填'),
                status: Joi.number().valid(userStatusValue).description('用户 状态')
            }),
            output: {
                success: Joi.boolean().required().description('if success').example(true),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.update
    },
    {
        meta: {
            swagger: {
                summary: '删除数据 delete',
                description: '',
                tags: ['user']
            }
        },
        path: '/user/delete',
        method: 'PUT',
        validate: {
            body: Joi.object({
                ids: Joi.array().required().description("id 数组"),
            }),
            output: {
                success: Joi.boolean().required().description('是否成功').example(true),
                message: Joi.string().when('success', {
                    is: false,
                    then: Joi.required().description('当 success 为 true 时 message 可选填, false 时 message 为必填').example('错误提示'),
                    otherwise: Joi.optional()
                })
            }
        },
        handler: userHandler.delete
    },
]