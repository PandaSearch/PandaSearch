## PandaSearch

[demo](http://search.onemue.cn/)

![PandaSearch 概念图](https://github.com/PandaSearch/PandaSearch/blob/main/images/image.png?raw=true)

技术栈

- Node
- Express
- Axios
- Cheerio

目录

- config // 配置
- engines // 引擎
- tools // 工具
- plugins // 插件
- network // 网络工具

BUG
- [x] 搜索多页如何处理
- [x] 多搜索结构如何处理
    > 引入因子概念，不同搜索引擎使用不同的因子，排序计算后的因子，以达到优先级计算
- [x] 去除无效搜索结果
- [x] 短时间内多次加载重复加载导致速度慢
    > 相关搜索关键字采用同一实例，多人同时搜索一个相同的关键词是搜索结果相同


优化
- [ ] 使用 Redis 存储搜索结果
- [ ] 使用多线程
- [ ] 载入合适的日志工具以及错误上报
- [x] 重写针对搜索结果去空去重算法
- [x] 开发自动加载引擎算法
- [ ] 针对多种搜索类型进行分类处理
    - [ ] 常规
    - [ ] 生活
    - [ ] 新闻
    - [ ] 图片
    - [ ] 视频
    - [ ] 文件
    - [ ] 音乐
    - [ ] 地图
- [ ] 针对搜索时间和语言的优化
- [x] 搜索页面
    - [x] 分页
- [ ] 引擎错误信息处理
- [ ] 合适的因子算法