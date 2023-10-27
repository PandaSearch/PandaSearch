## PandaSearch

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
- [ ] 搜索多页如何处理
- [ ] 多引擎多搜索结构如何处理
- [v] 多引擎去除无效搜索结果
- [ ] 短时间内多次加载重复加载导致速度慢


优化
- [ ] 载入合适的日志工具以及错误上报
- [ ] 重写针对搜索结果去空去重算法
- [ ] 开发自动加载引擎算法
- [ ] 针对多种搜索类型进行分类处理
    - [ ] 常规
    - [ ] 新闻
    - [ ] 图片
    - [ ] 视频
    - [ ] 文件
    - [ ] 音乐
    - [ ] 地图
- [ ] 针对搜索时间和语言的优化
- [v] 搜索页面
    - [v] 分页
- [ ] 引擎错误信息处理