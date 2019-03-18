// pages/feedBack/feedBack.js
const app = getApp()

Page({
  data: {
    feedBack: '',
    tel: ''
  },
  feedBack(e) {
    let feedBack = e.detail.value;
    this.setData({
      feedBack: feedBack
    });
  },
  tel(e) {
    let tel = e.detail.value;
    this.setData({
      tel: tel
    });
  },
  feedBackBtn() {
    let feedBack = this.data.feedBack
    let tel = this.data.tel
    let str = /^1[34578]\d{9}$/
    if (feedBack != '') {
      if (str.test(tel)) {
        wx.request({
          url: app.globalData.api +'/feedback/submit',
          method: 'POST',
          data: {
            content: feedBack,
            tel: tel
          },
          header: {
            'cookie': wx.getStorageSync("sessionid")
          },
          success(res) {

            wx.showToast({
              title: `提交成功`,
              success: (res) => {
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              }
            });
          }
        })
      }else {
        wx.showToast({
          title: `手机号格式错误！`,
          icon: 'none',
        })
      }
    }else {
      wx.showToast({
        title: `反馈内容不能为空！`,
        icon: 'none',
      })
    }
  }
});