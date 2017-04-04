//index.js
//获取应用实例
var sliderWidth = 96;
var http = require("../../utils/http.js");
var hellspawns = require("../../static/hellspawns.js");
var by = function(name){
 return function(o, p){
   var a, b;
   if (typeof o === "object" && typeof p === "object" && o && p) {
     a = o[name];
     b = p[name];
     if (a === b) {
       return 0;
     }
     if (typeof a === typeof b) {
       return a < b ? -1 : 1;
     }
     return typeof a < typeof b ? -1 : 1;
   }
   else {
     throw ("error");
   }
 }
}
var app = getApp()
Page({
  data: {
    hellspawnList: [],
    hellspawnMap: hellspawns.hellspawns.sort(by("name_pinyin")),
    popularList: [],
    searchText: "",
    isSearching: false,
    tabs: ["SSR", "SR", "R", "N"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0
  },
  //事件处理函数
  getPopular: function(){
    var url = http.generateUrl('api/v1/populars');
    var context = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if(res.data.status==1){
          context.setData({
            popularList: res.data.body.popular_list
          });
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  bindSearch: function(e) {
    var context = this;
    this.setData({
      searchText: e.detail.value,
    })
    if(this.data.searchText){
      this.setData({isSearching: true})
        var url = http.generateUrl('api/v1/search/' + this.data.searchText);
        wx.request({
          url: url,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            if (res.data.status==1){
              context.setData({
                hellspawnList: res.data.body.hellspawn_list,
                isSearching: false
              })
            }else{
              context.setData({
                isSearching: false
              })
            }
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
  },
  onShareAppMessage: function () {
    var title = '式神猎手 | 快速查寻阴阳师妖怪'
    return {
      title: title,
      path: 'pages/index/index'
    }
  },
  onShow:function(){
    this.getPopular();
  },
  onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
  
})
