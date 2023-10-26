// 百度的脚本
import network from '../network/index.js'
import cheerio from 'cheerio'
import { writeFile } from '../tools/index.js'
import axios from 'axios'
import crypto from 'crypto'


const about = {
    "website": 'https://so.toutiao.com/',
    "website_id": 'toutiao',
}

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
    'Cookie': 'msToken=OKfmxDgLfGQ8CAu0L_F4PGnTU26zgcolhg-bKlqbH4LdOGEFR5M-c68A1K-2rp8YQOjj7aDYuYHsKFU5Pric6TSEz2Yt4OEAMk8K0QAr; tt_webid=7294149911922443814; ttwid=1%7Cui8Q9vFydrffr-noL56KIoYhxbUREgcj8i94aDhGT8w%7C1698301633%7C214b7b50851738e1c6949f4db53b7b5e4ba73065804b682f69a68db1043c3b94; _ga_QEHZPBE5HH=GS1.1.1698301634.1.0.1698301634.0.0.0; _ga=GA1.1.1205396.1698301635; __ac_nonce=0653a06cd002e1f6b5118; __ac_signature=_02B4Z6wo00f01zz4P4AAAIDCLKbau.C-Ygs82DsAAKoOdd; __ac_referer=https://www.toutiao.com/; _tea_utm_cache_4916=undefined; _S_DPR=1; _S_IPAD=0; s_v_web_id=verify_lo6syb5u_eYE9qZgs_6eGt_4j5F_8gGv_vzVEe8K5cqnf; notRedShot=1; WIN_WH=1920_929; PIXIEL_RATIO=1; FRM=new; _S_WIN_WH=1920_929'
}

const search_url = `https://so.toutiao.com/search?dvpf=pc&source=pagination&keyword={key}&page_num={page}`

export default async (query, { page, pageSize }) => {
    let url = search_url.replace(/\{key\}/g, query)
    url = url.replace(/\{page\}/g, page)

    console.log(url)

    const res = await network.get(url, {
        headers
    })
    
    const $ = cheerio.load(res.data);
    await writeFile($.html());
    const container = $('.main>.s-result-list>div[data-i]');
    const results = [];
    for (let index = 0; index < container.length; index++) {
        const element = container[index];
        const href = url2($('.cs-view-block .cs-header a', element).attr('href'));
        const hash = crypto.createHash('sha256').update(href).digest('hex');

        results.push({
            hash,
            href,
            title: $('.cs-view-block .cs-header a', element).text(),
            content: $('.cs-view-block .cs-view-block .text-default span', element).text(),
            engine_id: about.website_id,
        })
    }

    return results
}


const url2 = (url) => {
    if (!url) {
        return ''
    }

    return decodeURIComponent(getUrlParams(url)['url'])
}


/**
 * @param {String} url
 * @description 从URL中解析参数
 */
const getUrlParams = (url) => {
    const keyValueArr = url.split("?")[1].split("&");
    let paramObj = {};
    keyValueArr.forEach((item) => {
      const keyValue = item.split("=");
      paramObj[keyValue[0]] = keyValue[1];
    });
    return paramObj;
  }