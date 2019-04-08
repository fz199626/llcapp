// pages/addAddress/addAddress.js
const app = getApp()

Page({
  data: {
    editAddress: [
      {
        id: 0,
        name: '',
        sex: '0',
        tel: '',
        address_info: '',
        door_plate: '',
        receiver_lat: '',
        receiver_lng: '',
        is_default: 0
      }
    ],
    checked: true,
    isPay: false
  },
  onLoad(options) {
    let that = this
    if (options.editAddress){ //判断是新增地址还是编辑地址
      let editAddress = JSON.parse(options.editAddress)
      let obj = 'editAddress[' + 0 + ']';
      this.setData({
        [obj]: editAddress
      })
    }
    if (options.isPay == 'true') { //判断上个页面是否是订单页面
      that.setData({
        isPay: true
      })
    }
  },
  name(event) {
    let name = 'editAddress[' + 0 + '].name';
    this.setData({
      [name]: event.detail
    })
  },
  man() {
    let man = 'editAddress[' + 0 + '].sex';
    this.setData({
      [man]: 0
    })
  },
  woman() {
    let woman = 'editAddress[' + 0 + '].sex';
    this.setData({
      [woman]: 1
    })
  },
  tel(event) {
    let tel = 'editAddress[' + 0 + '].tel';
    this.setData({
      [tel]: event.detail
    })
  },
  goMap() { //前往地图选择页面
    wx.navigateTo({
      url: '/pages/map/map'
    })
  },
  door_plate(event) {
    let door_plate = 'editAddress[' + 0 + '].door_plate';
    this.setData({
      [door_plate]: event.detail
    })
  },
  isDefault({detail}) {
    let is_default = 'editAddress[' + 0 + '].is_default';
    if (detail){
      this.setData({
        [is_default]: 1
      });
    }else{
      this.setData({
        [is_default]: 0
      });
    }
  },
  editBtn() { //地址提交按钮
    let that = this
    let data = that.data.editAddress[0]
    if (data.name != ''){
      if (data.tel != '') {
        if (data.address_info != '') {
          wx.request({
            url: app.globalData.api + '/address/add',
            method: 'POST',
            data: data,
            header: {
              'cookie': wx.getStorageSync("sessionid")
            },
            success(res) {
              if (that.data.isPay == true) {
                wx.navigateTo({
                  url: '/pages/pay/pay?orderAddress=' + res.data.data
                })
              } else {
                wx.navigateTo({
                  url: '/pages/address/address'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '地址不能为空!',
            icon: 'none',
          })
        }
      } else {
        wx.showToast({
          title: '手机号不能为空!',
          icon: 'none',
        })
      }
    }else {
      wx.showToast({
        title: '姓名不能为空!',
        icon: 'none',
      })
    }
  }
})