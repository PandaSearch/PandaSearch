import crypto from 'crypto'
import Engines from "./Engines.js";

export default class Results {
    static store;
    constructor(query, { page, pageSize }) {
        const hash = crypto.createHash('sha256').update(query).digest('hex');

        if (!Results.store) {
            Results.store = new Map();
        }

        if (Results.store.has(hash)) {
            return Results.store.get(hash);
        } else {
            this.hash = hash;
            this.query = query;
            this.page = 1;
            this.pageSize = pageSize;
            this.results = [];
            this.timer();
            Results.store.set(hash, this);
            
            return this;
        }
    };

    push (...item) {
        const filterItems = this.filter(...item);
        this.results.push(...filterItems);
        this.timer();
        this.sort();
    };
    
    pop () {
        this.results.pop();
        this.timer();
    };

    remove () {
        Results.store.delete(this.hash);
        clearTimeout(this.destroyTimer);
    };
    
    timer () {
        if (this.destroyTimer) {
            clearTimeout(this.destroyTimer);
        }
        this.destroyTimer = setTimeout(() => {
            this.remove();
        }, 10 * 60 * 1000);
        
        return this.destroyTimer;
    };

    filter (...items) {
        const engines = new Engines();

        if (engines.engines.length === 1) {
            return items
        }
        const filterItems = items.filter(item => !this.results.some((v, i) => {
            if (v.hash === item.hash) {
                const engines = this.results[i].engine_id.split(',')
                if (engines.find(v => v === item.engine_id) === -1) {
                    engines.push(item.engine_id)
                }

                // 存在多个相同是使用标注多个id
                this.results[i].engine_id = (Array.from(new Set(engines))).join(',');
                // 存在多个相同是使用最小的因子
                this.results[i].factor = Math.min(item.factor, engines.factor);
                return true
            }
            return false
        }))
        return filterItems
    }

    sort () {
        this.results = this.results.sort((a, b) => a.factor < b.factor ? -1 : 1)
    }

    async get ({ page, pageSize }) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const results = this.results.slice(startIndex, endIndex);
        const surplus = this.results.slice(endIndex);
        const engines = new Engines();

        // 被动搜索 如果条数不够就先搜新内容在返回
        if (results.length < pageSize) { 
            await engines.search(this.query, {page: this.page, pageSize: this.pageSize});
            this.page ++;
            return await this.get({page, pageSize});
        }
        
        // TODO 主动搜索? 目前存在问题
        // if (surplus.length < pageSize) {
        //     const page = this.page
        //     const pageSize = this.pageSize
        //     engines.search(this.query, {page, pageSize});
        // }

        return results;
    }
}