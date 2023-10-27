import crypto from 'crypto'
import Engines from "./Engines.js";
export default class Result {
    static store;
    constructor(query) {
        const hash = crypto.createHash('sha256').update(query).digest('hex');

        if (!Result.store) {
            Result.store = new Map();
        }

        if (Result.store.has(hash)) {
            return Result.store.get(hash)
        } else {
            this.hash = hash;
            this.query = query;
            this.results = [];
            this.timer();
            Result.store.set(hash, this)
            
            return this;
        }
    };

    push (...item) {
        const filterItems = this.filter(...item);
        this.results.push(...filterItems);
        this.timer();
    };
    
    pop () {
        this.results.pop();
        this.timer();
    };

    remove () {
        Result.store.delete(this.hash);
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

        console.log(engines.engines.length)

        if (engines.engines.length === 1) {
            return items
        }
        const filterItems = items.filter(item => !this.results.some((v, i) => {
            if (v.hash === item.hash) {
                const engines = this.results[i].engine_id.split(',')
                if (engines.find(v => v === item.engine_id) === -1) {
                    engines.push(item.engine_id)
                }

                this.results[i].engine_id = (Array.from(new Set(engines))).join(',')
                
                return true
            }
            return false
        }))
        return filterItems
    }
}