import { expect, test } from 'vitest';
import crypto from 'crypto';
import Results from "../../plugins/Results.js";

test('Results initialization.', () => {

    const query = "init Results";
    const results =  new Results(query);
    const hash = crypto.createHash('sha256').update(query).digest('hex');

    expect(results.hash).toBe(hash);
    expect(results.query).toBe(query);
    expect(results.results).toStrictEqual([]);
    // todo 判断是否为 Timeout 类型
    expect(results.destroyTimer._idleStart).toBeTypeOf('number');
});

test('Results operation.', () => {
    const query = "init Results";
    const results = new Results(query);
    const hash = crypto.createHash('sha256').update(query).digest('hex');

    // todo 操作添加
    results.push(1);
    expect(results.results).toStrictEqual([1]);
    // todo 操作删除
    results.pop();
    expect(results.results).toStrictEqual([]);
    // todo 操作清空
    results.remove()
    expect(Results.store.has(hash)).toStrictEqual(false);
    // todo 计时器
    const timer = results.timer();
    expect(timer).toBe(results.destroyTimer);
    // todo 清空
    results.remove();
    expect(Results.store.has(hash)).toBe(false);
});

test('Results Uniqueness.', () => {

    const query = Math.random().toString();
    const results1 =  new Results(query);
    const results2 = new Results(query);
    results1.push({
        url: 'baidu.com',
        title: '百度一下',
        content: '百度一下，你就知道'
    })
    results2.push({
        url: 'google.com',
        title: 'google',
        content: '咕噜咕噜'
    })
    const hash = crypto.createHash('sha256').update(query).digest('hex');

    expect(results1.hash).toBe(hash);
    expect(results1.query).toBe(query);
    expect(results2.query).toBe(query);
    expect(results2.results).toStrictEqual(results1.results);
});