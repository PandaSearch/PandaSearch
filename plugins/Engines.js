import fs from "fs";
import path from "path";
import Results from "./Results.js";
import baidu from "../engines/baidu.js";
import toutiao from "../engines/toutiao.js";

export default class Engines {
    constructor() {
      if (Engines._instance) {
        return Engines._instance
      }
      this.initEngines();
      Engines._instance = this;
    }
  
    static getInstance() {
      return Engines._instance;
    }
  
    async search(query, { page = 1, pageSize = 10 }) {
        const results = new Results(query);

        for (const engine of this.engines) {
          let engineResults = await engine(query, { page, pageSize });
          
          engineResults = engineResults.filter(result => result.title && result.href && result.content);

          results.push(...engineResults);
        }

        return results;
    }

    initEngines() {
        this.engines = [baidu, toutiao];
    }


  }