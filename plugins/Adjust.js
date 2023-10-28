import Results from "./Results.js";
export default class Adjust {
    constructor(query, {page, pageSize}) {
        this.query = query;
        this.page = Number(page);
        this.pageSize = Number(pageSize);

        return this
    }

    async results () {
        const page = this.page || 1;
        const pageSize = this.pageSize || 10;
        const results = new Results(this.query, { page, pageSize });

        return await results.get({ page, pageSize });
    }
}