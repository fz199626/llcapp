// pages/address/address.js
const app = getApp()

Page({
  data: {
    addressData: [],
    isPay: false
  },
  addressList() {
    let that = this
    wx.request({ //收货地址列表
      url: app.globalData.api + '/address/list',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        that.setData({
          addressData: res.data.data.items
        })
      }
    })
  },
  onLoad(options) {
    let that = this
    if (options.isPay){ //判断上个页面是否是订单页面
      that.setData({
        isPay: true
      })
    }
    that.addressList()
  },
  addAddress(e) { //添加地址
    wx.navigateTo({
      url: '../addAddress/addAddress?isPay=' + this.data.isPay
    })
  },
  selectAddress(e) { //选择地址给订单页
    let index = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/pay/pay?orderAddress=' + this.data.addressData[index].id
    })
    // let pages = getCurrentPages(); //获取上一个页面信息栈(pay页面)
    // let prevPage = pages[pages.length - 2] //给上一个页面的pay赋值
    // prevPage.setData({
    //   "orderAddress[0]": this.data.addressData[index],
    // });
    // wx.navigateBack(); //关闭当前页面，返回上一个页面
  },
  editAddress(e) { //编辑地址
    let index = e.currentTarget.id
    let editAddress = JSON.stringify(this.data.addressData[index])
    wx.navigateTo({
      url: '/pages/addAddress/addAddress?isPay=' + this.data.isPay +'&editAddress=' + editAddress
    })
  },
  setDefault(e) { //设置为默认地址
    console.log(e.currentTarget.id)
  },
  delAddress(e) { //删除地址
    let that = this
    wx.request({
      url: app.globalData.api + '/address/del',
      method: 'POST',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      data: {
        id: that.data.addressData[e.currentTarget.id].id
      },
      success(res) {
        wx.showToast({
          title: res.data.msg,
          success: (res) => {
            that.addressList()
          }
        });
      }
    })
  }
})