// pages/problem/problem.js
Page({
  data: {
    activeNames: ['1']
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  }
});