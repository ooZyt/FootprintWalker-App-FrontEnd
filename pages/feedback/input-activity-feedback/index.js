Page({
  data: {
    activity: {}, // 存储点击的活动信息
  },

  onLoad: function(options) {
    // 从上个页面获取传递过来的活动信息并保存到 data 中
    this.setData({
      activity: JSON.parse(options.activity),
    });
  },

  submitFeedback: function(event) {
    // 获取用户输入的反馈信息
    const title = event.detail.value.title;
    const content = event.detail.value.content;
    const rating = this.data.rating; // 假设已经获取到评分值

    // 在这里执行提交反馈的操作，可以发送网络请求等

    // 提交成功后，可以跳转回上一页或其他操作
    wx.navigateBack({
      delta: 1 // 返回上一页
    });
  }
});
