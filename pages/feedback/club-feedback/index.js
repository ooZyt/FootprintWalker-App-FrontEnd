// pages/feedback/club-feedback/index.js
Page({
  data: {
    club: {
      avatar: '/images/club.png', // 社团头像
      description: '对社团有任何疑问或建议都可以写在这里~' // 社团介绍
    }
  },

  submitFeedback: function(event) {
    // 获取用户输入的反馈信息
    const title = event.detail.value.title;
    const content = event.detail.value.content;

    // 在这里执行提交反馈的操作，可以发送网络请求等

    // 提交成功后，可以跳转回上一页或其他操作
    wx.navigateBack({
      delta: 1 // 返回上一页
    });
  }
});
