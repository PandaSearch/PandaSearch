// 百度的脚本
import network from '../network/index.js'
import cheerio from 'cheerio'
import { writeFile, computeFactor } from '../tools/index.js'
import axios from 'axios'
import crypto from 'crypto'


const about = {
    "website": 'https://quark.sm.cn',
    "website_id": 'quark',
    "factor": 111
}

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
    'Cookie': 'BIDUPSID=B30F308B1B08284D94460A6178682A0B; PSTM=1696470864; BD_UPN=12314753; newlogin=1; BDUSS=VYZHhzUlVXUkZBcHRyS3gtR2pLVTBLUklzR0pPWGEzcmhOSlhwbHpJQkFyRXhsRVFBQUFBJCQAAAAAAAAAAAEAAAAkItjpRdLgxL4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAfJWVAHyVlQm; BDUSS_BFESS=VYZHhzUlVXUkZBcHRyS3gtR2pLVTBLUklzR0pPWGEzcmhOSlhwbHpJQkFyRXhsRVFBQUFBJCQAAAAAAAAAAAEAAAAkItjpRdLgxL4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAfJWVAHyVlQm; BAIDUID=8ED8FDA1AFB38A39F772C346357A18FB:SL=0:NR=20:FG=1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; ab_sr=1.0.1_ZDQzOGE2ZmZmYTdlNDkyMzFmNDY4MWI5YzdkMjJmMjM1NTAxNzdmZThiNjg0NmNiNzBmOGM1NmRjZjYyMDE4MGUwOGY5ZjNiM2Q1ZTNmZGRiMTNhY2IxMWJmMzhlOTg4MGVhZjEzZDY2NWY2N2U3Y2M0ZWFhYjQxODU3MWUzNGM2MWU0MGM4N2NiYTZlZmNhN2JiYTUyNTFlZjA1ZTk3Yw==; BAIDUID_BFESS=8ED8FDA1AFB38A39F772C346357A18FB:SL=0:NR=20:FG=1; channel=baidusearch; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; delPer=0; BD_CK_SAM=1; PSINO=1; BA_HECTOR=2l2l2k2gak24250ka08l2lab1ijf0vr1p; ZFY=cfWHDh:BOFJdYwbWu:BSWLxKXekklLyZyP7b7Vd629Zuc:C; sug=0; sugstore=0; ORIGIN=0; bdime=0; H_PS_PSSID=39360_39447_39396_39531_39420_39497_39475_39233_39467_26350; H_PS_645EC=6717C8s6HSIq%2B57jruCAyrsVRvf4zu61QC2h7mmV%2BMEfna8oBCrqkgQ%2BzfDnZ5WP%2BB4t; baikeVisitId=b39da73d-d550-4454-9944-78d2633164f4; BDSVRTM=22'
}

// 
// &s_from=index&sut=1907&sst0=1698543339256&lkt=0%2C0%2C0&sugsuv=1698530464840294&sugtime=1698543339256&ie=utf8&p=40040100&dp=1&w=01019900&dr=1
const search_url = `https://quark.sm.cn/s?q={key}&safe=2&snum=6&by=next&med_theme=&layout=html&page={page}`

export default async (query, { page, pageSize }) => {
    let url = search_url.replace(/\{key\}/g, query)
    url = url.replace(/\{page\}/g, page)
    url = url.replace(/{pageSize}/g, pageSize)

    console.log(url)
    const res = await network.get(url, {
        headers
    })
    
    const $ = cheerio.load(res.data);
    // await writeFile($('.result').html(), 'log/so.html');
    const container = $('.c-container');
    const results = [];

    for (let index = 0; index < container.length; index++) {
        const element = container[index];
        const href = await url2($('a', element).attr('href'));
        const hash = crypto.createHash('sha256').update(href).digest('hex');
        console.log('[quark:url]'+href)

        results.push({
            hash,
            href,
            title: $('.c-header-title .inner-query', element).text(),
            content: $('.js-c-paragraph-text', element).text(),
            engine_id: about.website_id,
            factor: computeFactor(index, about.factor)
        })
    }

    return results
}


const url2 = async (url) => {
    if (!url) {
        return ''
    }
    try {
        const info = new URL(url);
        const options = {
            method: "GET",
            headers: {
                // "Host": info.host,
                // "Connection": "keep-alive"
            }
        };
        const response = await axios(url, options)
    
        const responseUrl = response?.request?.res?.responseUrl
        // console.log(`[url2]${url} -> ${responseUrl}`);
        
        return responseUrl
    } catch (error) {
        return ''
    }

}