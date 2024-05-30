// feedback-detail.js
Page({
  data: {
    feedback: {
      id: 1,
      title: '关于千岛湖游玩',
      content: '反馈的内容非常丰富，涉及到很多方面...',
      time: '2023-05-16 08:00',
      activity: '千岛湖游玩',
      rating: 5,
      reply: {
        content: '感谢您的反馈，我们会尽快处理。',
        time: '2023-05-17 10:00'
      }
    }, // 反馈信息
    feedbackType: 'activity' // 反馈类型，'activity' 或 'club'
  },

  onLoad: function (options) {
    const feedback = JSON.parse(options.feedback); // 从上一页获取传递过来的反馈信息
    const feedbackType = feedback.type; // 获取反馈类型

    getReply(feedback)

    // 设置页面数据
    this.setData({
      feedback: feedback,
      feedbackType: feedbackType
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: feedbackType === 'activity' ? '活动反馈详情' : '社团反馈详情'
    });
  },
  getReply: function (feedback) {
    // 在这里从数据库查询回复

    // 更新页面数据
    feedback.setData({
      reply: {
        content: '感谢您的反馈，我们会尽快处理。',
        time: '2023-05-17 10:00'
      }
    });
  }
});
