
// 获取指定区间范围随机数
export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}