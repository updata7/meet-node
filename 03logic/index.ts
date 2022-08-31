/*
 * @Author: CKJiang 
 * @Date: 2022-08-31 16:57:37 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-31 17:05:07
 */

/**
 * 深度查找父母节点
 * @param obj 
 * @param level 父节点的层级深度
 * @returns 父级的obj
 */
function deepFindParent(obj: any, level: number): any {
    if (obj.lv === level) return obj
    return deepFindParent(obj.child, level)
}

/**
 * 字符串转json 助手
 * @param strArr 字符串数组
 * @param index  当前索引
 * @param regExp 层级缩进符
 * @param json 用于递归操作的json，当level为0时，json = outJson
 * @param outJson 最终输出的json
 * @param parentCode 父母层级的节点
 * @returns 
 */
function str2JsonHelper(strArr: Array<string>, index: number, regExp: RegExp, json: any, outJson: any, parentCode?: number): any {
    const str = strArr[index];
    const level = str.match(regExp) ? str.match(regExp)!.length : 0; // 0为顶级 1为次顶级，依次类推

    const obj: any = {
        lv: level,
        name: str.replace(regExp, ''),
        code: index+1,  // code 是从1开始算
    }
    if (level > 0) {
        // 非顶级节点，则有父母节点
        obj.parentCode = parentCode;
    }
    json.push(obj)
    const nextStr = strArr[index+1]
    if (!nextStr) return;

    const nextLevel = nextStr.match(regExp) ? nextStr.match(regExp)!.length : 0;
    // console.log('************************************************')
    // console.log('index ===========> ', index);
    // console.log('nextLevel ===========> ', nextLevel);
    // console.log('level ===========> ', level);
    // console.log('json ===========> ', json)
    // console.log('outJson ===========> ', outJson);
    // console.log('************************************************')
    if (nextLevel > level) {
        // 有子节点
        if (!json[json.length-1].child) json[json.length-1].child = []
        return str2JsonHelper(strArr, ++index, regExp, json[json.length-1].child, outJson, obj.code)
    }
    if (nextLevel === 0) {
        // 顶级节点
        json = outJson
        return str2JsonHelper(strArr, ++index, regExp, json, outJson)
    }

    // nextLevel <= level 查找父节点
    const fatherObj = deepFindParent(outJson[outJson.length - 1], nextLevel-1)
    return str2JsonHelper(strArr, ++index, regExp, fatherObj.child, outJson, fatherObj.code)
}

/**
 * 
 * @param str 字符数据
 * @param reg 层级关系缩进符
 * @returns 
 */
function str2Json(str: string, reg: string = '\t'): object {
    if (!str) return [];

    const regExp = new RegExp(reg, 'g');
    const strArr = str.split('\n');
    const outJson = []
    const json = outJson
    const index = 0
    str2JsonHelper(strArr.filter(r => r), index, regExp, json, outJson)
    return outJson
}

const s = `
1
    1.1
        1.1.1
    1.2
2
    2.1
        2.1.1
`
console.log(JSON.stringify(str2Json(s, '    ')))