// pages/card/card.js
Page({
  data: {
    cardData: [
      {
        cardNumber: '156565565',
        cardSun: 6,
        cardTitle: '优惠券',

      },
      {
        cardNumber: '121222122',
        cardSun: 3,
        cardTitle: '优惠券',

      }
    ]
  },
  onLoad(options) {

  },
  cardTab(e) {
    // wx.showToast({
    //   title: `点击标签 ${e.detail.index + 1}`,
    //   icon: 'none'
    // });
  }
})