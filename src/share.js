//
// var imgurl = "https://omgmkt.qq.com" + window.avatar;
// // var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxadeaeb4fa9dd764c&redirect_uri=https%3A%2F%2Fomgmkt.qq.com%2Fwx%2Fcallback&response_type=code&scope=snsapi_userinfo&state=https%3A%2F%2Fomgmkt.qq.com%2Ftencent_news%2F201909%2F70years%2F#wechat_redirect";
// var url = "https://omgmkt.qq.com/tencent_news/201909/70years/auth"
// var texts = [
//     '11万军民，仅用4年，便修筑了世界的“天路”',
//     '脚动挡的“网红”汽车开创了一个时代',
//     '这个东北油田的诞生让中国脱掉了贫油的帽子',
//     '59年前真实版《攀登者》，只为让五星红旗打卡珠峰',
//     '从1963年开始，中国人就再也不怕断手了',
//     '石臼、铁锅、豆腐包，我国首颗原子弹竟是这样炼制出来的',
//     '计算机也解不开的难题，他仅凭纸笔就有了突破',
//     '袁隆平：我毕生的心愿是让所有人远离饥饿',
//     '开完这个会人民的生活从短缺走向充裕、从贫困走向小康',
//     '他让《义勇军进行曲》第一次响彻奥运会赛场',
//     '世界人民的生活便利程度，都被我国提高了',
//     '嫦娥也对他赞不绝口：能平安返回才叫成功',
//     '这个运可不是求来的，靠的是全中国人民的努力',
//     '七年前，中国海军结束了没有航母的历史',
//     '他的作品，曾成就了一代大导演张艺谋',
//     '如今丝绸之路上买卖的，是最有前景的东西',
//     '她对世界的贡献，与爱因斯坦齐名',
//     '全球灵敏性最高的射电望远镜是个狠角色',
//     '我国首款第五代战斗机原来这么厉害！',
//     '复兴号太快了！中国速度毋庸置疑',
//     '这座大桥，不愧是新“世界七大奇迹”之一！'
// ]
// setInterval(function(){
//     if(window._swiper){
//         if(isqqnews()){
//             window.TencentNews.setShareArticleInfo(texts[window.tmpArr[window._swiper.realIndex]], '为祖国庆生，这些高光时刻你怎能不知道',
//             texts[window.tmpArr[window._swiper.realIndex]],
//             //`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxadeaeb4fa9dd764c&redirect_uri=https%3A%2F%2Fomgmkt.qq.com%2Fwx%2Fcallback&response_type=code&scope=snsapi_userinfo&state=https%3A%2F%2Fomgmkt.qq.com%2Ftencent_news%2F201909%2F70years%2F%3Findex%3D${window.tmpArr[window._swiper.realIndex]}#wechat_redirect`,
//             `https://omgmkt.qq.com/tencent_news/201909/70years/auth?index=${window.tmpArr[window._swiper.realIndex]}`,
//             "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'));
//         }
//     }
//     else{
//         if(isqqnews()){
//             window.TencentNews.setShareArticleInfo('为祖国庆生，这些高光时刻你怎能不知道', '新中国的21个高光时刻，你都知道吗？',
//             '新中国的21个高光时刻，你都知道吗？', url,
//             "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'));
//         }
//     }
// },100)
// window.wxcallback=(json)=>{
//     if(!isWeiXin()){
//         return;
//     }
//     // console.log(ShareImage)
//     wx.config({
//         debug: false,
//         appId: json.appId,
//         timestamp: json.timestamp,
//         nonceStr: json.nonceStr,
//         signature: json.signature,
//         jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showOptionMenu']
//     });
//     var title = "";
//     var imgurl = "https://omgmkt.qq.com" + window.avatar;
//     setInterval(()=>{
//         if(window._swiper){
//             wx.onMenuShareAppMessage({
//                 desc: "为祖国庆生，这些高光时刻你怎能不知道",
//                 title: texts[window.tmpArr[window._swiper.realIndex]],
//                 //link: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxadeaeb4fa9dd764c&redirect_uri=https%3A%2F%2Fomgmkt.qq.com%2Fwx%2Fcallback&response_type=code&scope=snsapi_userinfo&state=https%3A%2F%2Fomgmkt.qq.com%2Ftencent_news%2F201909%2F70years%2F%3Findex%3D${window.tmpArr[window._swiper.realIndex]}#wechat_redirect`,
//                 link:`https://omgmkt.qq.com/tencent_news/201909/70years/auth?index=${window.tmpArr[window._swiper.realIndex]}`,
//                 imgUrl: "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'),
//                 type: '',
//                 dataUrl: '',
//                 success: function () {
//                     MtaH5.clickStat("sharefriend")
//                     MtaH5.clickStat("sharefriendlogs")
//                 },
//                 cancel: function () { },
//             });
//             wx.onMenuShareTimeline({
//                 title:texts[window.tmpArr[window._swiper.realIndex]],
//                 // link: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxadeaeb4fa9dd764c&redirect_uri=https%3A%2F%2Fomgmkt.qq.com%2Fwx%2Fcallback&response_type=code&scope=snsapi_userinfo&state=https%3A%2F%2Fomgmkt.qq.com%2Ftencent_news%2F201909%2F70years%2F%3Findex%3D${window.tmpArr[window._swiper.realIndex]}#wechat_redirect`,
//                 link:`https://omgmkt.qq.com/tencent_news/201909/70years/auth?index=${window.tmpArr[window._swiper.realIndex]}`,
//                 imgUrl: "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'),
//                 success: function () {
//                     MtaH5.clickStat("sharemoment")
//                     MtaH5.clickStat("sharemomentlogs")
//                 },
//                 cancel: function () { }
//             });
//
//         }
//
//     }, 100)
//     wx.ready(function () {
//         wx.onMenuShareAppMessage({
//             title: "为祖国庆生，这些高光时刻你怎能不知道",
//             desc: "新中国的21个高光时刻，你都知道吗？",
//             link: url,
//             imgUrl: "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'),
//             type: '',
//             dataUrl: '',
//             success: function () {
//                 MtaH5.clickStat("sharefriend")
//                 MtaH5.clickStat("sharefriendlogs")
//             },
//             cancel: function () { },
//         });
//         wx.onMenuShareTimeline({
//             title: "为祖国庆生，这些高光时刻你怎能不知道",
//             link: url,
//             imgUrl: "https://omgmkt.qq.com/tencent_news/201909/70years/" + require('../sources/shareimg.png'),
//             success: function () {
//                 MtaH5.clickStat("sharemoment")
//                 MtaH5.clickStat("sharemomentlogs")
//             },
//             cancel: function () { }
//         });
//         wx.error(function(res){
//             //alert("非正式网址，无法配置微信分享")
//         });
//     });
// }
// //document.writeln('<script src="http://host/wechat/config/?url='+encodeURIComponent(location.href)+'&callback=wxcallback"></script>');
// document.writeln('<script src="//omgmkt.qq.com/api/share?url='+encodeURIComponent(location.href)+'&callback=wxcallback"></script>');
//
