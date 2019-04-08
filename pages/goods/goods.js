// pages/goods/goods.js
const app = getApp()

Page({
  data: {
    dataList: [],
    contentActive: '',
    navActive: '',
    heightArr: [],
    isCartShadeShow: false,
    isStandardShow: false,
    cartData: {
      "num": "0",
      "total": 0
    },
    // items: [
    //   {
    //     title: '大小',
    //     item: [
    //       { name: '0', value: '大', checked: 'true' },
    //       { name: '1', value: '中' },
    //       { name: '2', value: '小' }
    //     ]
    //   },
    //   {
    //     title: '温度',
    //     item: [
    //       { name: '0', value: '冷', checked: 'true' },
    //       { name: '1', value: '温' },
    //       { name: '2', value: '热' }
    //     ]
    //   }
    // ],
    good: [],
    standardArr: [0, 0],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  cartData() { //购物车列表数据！
    let that = this 
    wx.request({
      url: app.globalData.api + '/cart/list',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        if (res.data.data != null) {
          that.setData({
            cartData: res.data.data,
          })
        }
        if (res.data.data.num <= 0) {
          that.setData({
            isCartShadeShow: false
          })
        }
      }
    })
  },
  goodData() { //商品列表数据！
    let that = this
    wx.request({ //商品列表数据！
      url: app.globalData.api + '/goods/list',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        that.setData({
          dataList: res.data.data
        })
      }
    })
  },
  onLoad(options) { //监听页面加载
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    let that = this
    // that.cartData()
    that.goodData()
  },
  onShow() {
    let that = this
    that.cartData()
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.cartData()
    this.goodData()
  },
  tab(e) {//分类切换
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      contentActive: id,
      navActive: index
    })
  },
  onScroll(e) {//滑动关联分类
    // let scrollTop = e.detail.scrollTop-100;
    let scrollTop = e.detail.scrollTop;
    let scrollArr = this.data.heightArr;
    if(scrollTop >= scrollArr[scrollArr.length - 1]) {
      return
    }else {
      for(let i = 0; i < scrollArr.length; i++) {
        if(scrollTop >= 0 && scrollTop < scrollArr[0]){
          this.setData({
            navActive: 0
          })
        }else if(scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]){
          this.setData({
            navActive: i
          })
        }
      }
    }
  },
  ready() {
    let query = wx.createSelectorQuery().in(this);
    let heightArr = [];
    let s = 0;
    query.selectAll('.goodList').boundingClientRect((react) => {
      react.forEach((res) => {
        s +=res.height;
        heightArr.push(s)
      })
      this.setData({
        heightArr: heightArr
      })
    })
    query.selectAll('.right').boundingClientRect((res) => {
      // this.setData({
      //   heightArr: res.height
      // })
    }).exec()
  },
  isStandardShowBtn(e) {//规格弹窗
    let that = this;
    let good = that.data.good
    let goodObj = e.currentTarget.dataset.good
    if (goodObj){
      good[0] = goodObj
    }
    that.setData({
      good,
      isStandardShow: (!that.data.isStandardShow)
    })
  },
  isCartShadeShowBtn(e) {//购物车弹窗
    let that = this;
    let totalNum = that.data.totalNum;
    if (that.data.cartData.num > 0) {
      that.setData({
        isCartShadeShow: (!that.data.isCartShadeShow)
      })
    }
  },
  radioChange(e) {//规格选择
    let that = this;
    let index = e.currentTarget.dataset.id 
    let items = that.data.items;
    let checkArr = e.detail.value;
    let standardArr = that.data.standardArr;
    for (var i = 0; i < items[index].item.length; i++) {
      if(checkArr.indexOf(i + "") != -1) {
        items[index].item[i].checked = true;
        standardArr[index] = i
      }else {
        items[index].item[i].checked = false;
      }
    }
    console.log(standardArr)
    that.setData({
      items: items
    })
  },
  selectBtn(e) {//添加商品到购物车
    let that = this;
    // let newGood = that.data.good[0]
    //   newGood['num'] = 1
    // let cartData = that.data.cartData
    // cartData.splice(1, 0, newGood)//此处缺少是否是同一商品的判断（包括选择的规格是否完全相同）
    that.setData({
      // cartData,
      isStandardShow: (!that.data.isStandardShow)
    })
    // that.getTotalPrice()
    that.setCard(e.currentTarget.id, 1)
  },
  add(e) {//增加商品数量
    let that = this;
    // let index = e.currentTarget.id
    // let num_str = 'cartData[' + index + '].num';
    // that.setData({
    //   [num_str]: that.data.cartData[index].num + 1
    // })
    // that.getTotalPrice()
    that.setCard(e.currentTarget.id, 1)
  },
  reduce(e) {//减少商品数量（如果商品数量少于1，商品从购物车删除）
    let that = this;
    // let index = e.currentTarget.id
    // let num_str = 'cartData[' + index + '].num';
    // let num = that.data.cartData[index].num
    // if (num > 1){
    //   that.setData({
    //     [num_str]: num - 1
    //   })
    // }else{
    //   let cartData = that.data.cartData
    //   cartData.splice(index, 1)
    //   that.setData({
    //     cartData
    //   })
    // }
    // that.getTotalPrice()
    that.setCard(e.currentTarget.id, 2)
  },
  getTotalPrice() {//计算购物车内商品的总价格
    let that = this;
    let cartData = that.data.cartData;
    let totalNum = 0;
    let totalPrice = 0;
    for (let i = 0; i < cartData.length; i++) {
      totalNum += cartData[i].num;
      totalPrice += cartData[i].num * cartData[i].price;
    }
    if(totalNum == 0) {
      that.setData({
        isCartShadeShow: (!that.data.isCartShadeShow)
      })
    }
    that.setData({
      totalNum: totalNum,
      totalPrice: totalPrice.toFixed(2),
    })
  },
  goPay() {//结算按钮跳到结算页面
    let that = this;
    let num = that.data.totalNum
    if (that.data.cartData.num > 0) {
      wx.navigateTo({
        url: '/pages/pay/pay'
      })
    }
  },
  onReady() { //监听页面初次渲染完成
    this.ready()
  },
  setCard(id, identifier) { //购物车数据操作接口！
    let that = this
    wx.request({
      url: app.globalData.api + '/cart/cart-update',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      data: {
        goods_id: id,
        identifier: identifier
      },
      success(res) {
        that.cartData()
      }
    })
  },
  onShareAppMessage() { //用户点击右上角分享

  }
})