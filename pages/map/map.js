// pages/map/map.js
var amapFile = require('../../libs/amap-wx.js');

Page({
  data: {
    tips: {}
  },
  onLoad() {
    
  },
  bindInput(e) {
    var that = this;
    var keywords = e.detail.value;
    // var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: '2e9f28a0ffc204554bd683cbea123957' });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '31.22799,121.466383',
      city: '上海市',
      success(data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindSearch(e) {
    let tips = this.data.tips
    let index = e.target.dataset.index;
    let pages = getCurrentPages(); //获取上一个页面信息栈(addAddress页面)
    let prevPage = pages[pages.length - 2] //给上一个页面的address赋值
    let location = tips[index].location.split(",");
    prevPage.setData({
      "editAddress[0].address_info": tips[index].name,
      "editAddress[0].receiver_lng": location[0],
      "editAddress[0].receiver_lat": location[1]
      });
    wx.navigateBack(); //关闭当前页面，返回上一个页面
  }
})