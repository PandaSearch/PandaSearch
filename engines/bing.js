// 百度的脚本
import network from '../network/index.js'
import cheerio from 'cheerio'
import { writeFile, computeFactor } from '../tools/index.js'
import axios from 'axios'
import crypto from 'crypto'


const about = {
    "website": 'https://www.bing.com/',
    "website_id": 'bing',
    "factor": 20
}

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
    'Cookie': '_EDGE_V=1; MUID=0A347EEA49406D0C055C6D4B48266C37; MUIDB=0A347EEA49406D0C055C6D4B48266C37; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=78D5DB4518CC46D0A1E6E10774995811&dmnchg=1; ANON=A=C25D64110E1C0A2D4F7F1D6FFFFFFFFF; MUIDV=NU=1; MMCASM=ID=74B3AE3D0D954B29BE739E262D63EDA3; _TTSS_IN=hist=WyJlbiIsInpoLUhhbnMiLCJhdXRvLWRldGVjdCJd&isADRU=0; _TTSS_OUT=hist=WyJ6aC1IYW5zIiwiZW4iXQ==; _tarLang=default=en; MicrosoftApplicationsTelemetryDeviceId=e4b50bcd-7b3b-467b-9d4e-17759ebed771; ISSW=1; WLS=C=a093a066d51d270b&N=%e6%a2%85%e8%8a%b1; SRCHS=PC=EDGEXST; _EDGE_S=SID=11D4FC22EFEE678D3836EF95EEE6663E&mkt=en-us; _UR=QS=0&TQS=0&cdxcls=0; _Rwho=u=d; _SS=SID=11D4FC22EFEE678D3836EF95EEE6663E&PC=EDGEXST&R=4492&RB=4492&GB=0&RG=0&RP=4492; ipv6=hit=1698387592108&t=6; ai_session=u0KWAtKq+1rfLF2nFLICMK|1698387493849|1698387493849; _HPVN=CS=eyJQbiI6eyJDbiI6MywiU3QiOjAsIlFzIjowLCJQcm9kIjoiUCJ9LCJTYyI6eyJDbiI6MywiU3QiOjAsIlFzIjowLCJQcm9kIjoiSCJ9LCJReiI6eyJDbiI6MywiU3QiOjAsIlFzIjowLCJQcm9kIjoiVCJ9LCJBcCI6dHJ1ZSwiTXV0ZSI6dHJ1ZSwiTGFkIjoiMjAyMy0xMC0yN1QwMDowMDowMFoiLCJJb3RkIjowLCJHd2IiOjAsIkRmdCI6bnVsbCwiTXZzIjowLCJGbHQiOjAsIkltcCI6MTl9; USRLOC=HS=1&ELOC=LAT=31.2718563079834|LON=120.73499298095703|N=%E5%90%B4%E4%B8%AD%E5%8C%BA%EF%BC%8C%E6%B1%9F%E8%8B%8F%E7%9C%81|ELT=4|&CLOC=LAT=39.8877|LON=116.2828|A=733|TS=231027052005|SRC=I; _U=11ikmP788Rhn1q2zEqi8hiMKCfBHAfINVQ6vQZlrC06nUqDPZ49An_3k0vbSO0YZtnIIo78dvVSfWGcZsoLqAy125ad9Yl7H46EqD-TQP3nmLvUU50XyEq8Cos9pTe795tPfpO0im3lhOU3FzVXa25xCnK_ByoRrFdoN3IyOIJUE5AaGVJQeF-J4hHY0nbfeTH9jOc-LyU34Iqr4PZn5PBrmYLEo49IhWQqB5DNbcgEY; BFPRResults=FirstPageUrls=F9F40A382C87F111AC6403E4241DF3B2%2CC09A782AFFDACC07197EC38067E90F15%2CBD2FBAB487EF3E562BA77D3E0A848602%2CEF7E410A208D5F7D6EF143480F9C3D8C%2C19881C787E0E66D3C8BB270E1A0B213C%2CAA79650778868CDF27D07F57E7458BE4%2C8F241A02922D2A1AF78B9143CE0C8CE3%2C33A6B3746253A7F56E232491984813D9%2CDE85E146178577791CD899FDC5C0C03D%2C2E2F40CCA36B8E9F8A977528C03F5F13&FPIG=C81C6D0AA9FD4CF697CD20873B0EBE02; SRCHUSR=DOB=20231005&T=1698387559000; _RwBf=mta=0&rc=4492&rb=4492&gb=0&rg=0&pc=4492&mtu=0&rbb=0.0&g=0&cid=&clo=0&v=49&l=2023-10-26T07:00:00.0000000Z&lft=0001-01-01T00:00:00.0000000&aof=0&o=0&p=bingcopilotwaitlist&c=MY00IA&t=3770&s=2023-03-24T03:15:51.8496741+00:00&ts=2023-10-27T06:19:49.5658276+00:00&rwred=0&wls=0&wlb=0&lka=0&lkt=0&TH=&dci=3&e=DWFw2Q389G_ExPLElHV17aCU8k6yzUHJ3xpM9L_tw1KsZ6fDWMBRkU5mBVD4h35z7jJIpk2Ablna1E7aszjrWw&A=&aad=0; SRCHHPGUSR=SRCHLANG=zh-Hans&PV=15.0.0&BZA=0&BRW=XW&BRH=S&CW=1920&CH=332&SCW=1905&SCH=3577&DPR=1.0&UTC=480&DM=0&EXLTT=31&HV=1698387708&PRVCW=1920&PRVCH=929&IG=78482D588A8F42A69170859DC142D808'
}



const search_url = 'https://www.microsoft.com/en-us/bing/apis/bing-web-search-api'

export default async (query, { page, pageSize }) => {
    let url = search_url.replace(/\{key\}/g, query)
    url = url.replace(/\{page\}/g, ((page - 1) * pageSize) + 1)
    url = url.replace(/{pageSize}/g, pageSize)
    const res = await network.get(url, {
        headers
    })
    
    const $ = cheerio.load(res.data);
    // await writeFile($('#content_left').html());
    const container = $('.result.c-container .c-container');
    const results = [];
    for (let index = 0; index < container.length; index++) {
        const element = container[index];
        const href = await url2($('.c-title a', element).attr('href'));
        const hash = crypto.createHash('sha256').update(href).digest('hex');

        results.push({
            hash,
            href,
            title: $('.c-title a', element).text(),
            content: $('span.content-right_8Zs40', element).text(),
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
                "Host": info.host,
                "Connection": "close"
            }
        };
        const response = await axios(url, options)
    
        const responseUrl = response?.request?.res?.responseUrl
        console.log(`[url2]${url} -> ${responseUrl}`);
        
        return responseUrl
    } catch (error) {
        return ''
    }

}