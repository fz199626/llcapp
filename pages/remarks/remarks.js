// pages/remarks/remarks.js
Page({
  data: {
    remarks: ''
  },
  onLoad(options) {
    if (options.remarks !='需要打包/加料等'){
      let remarks = options.remarks
      this.setData({
        remarks: remarks
      })
    }
  },
  remarks(e) {
    let remarks = e.detail.value;
    this.setData({
      remarks: remarks
    });
  },
  remarksBtn() {
    let remarks = this.data.remarks;
    let pages = getCurrentPages(); //获取上一个页面信息栈(pay页面)
    let prevPage = pages[pages.length - 2] //给上一个页面的remarks赋值
    prevPage.setData({ "remarks": remarks });
    wx.navigateBack(); //关闭当前页面，返回上一个页面
  }
});