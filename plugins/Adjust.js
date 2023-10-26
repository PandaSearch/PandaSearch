import Engines from "./Engines.js";

export default class Adjust {
    constructor(query, {page, pageSize}) {
        this.query = query;
        this.page = Number(page);
        this.pageSize = Number(pageSize);

        return this
    }

    async results () {
        const page = this.page;
        const pageSize = this.pageSize;
        const engines = new Engines();
        const results = await engines.search(this.query, {page, pageSize});
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return results.results.slice(startIndex, endIndex);
    }
}