Page({
  data: {
    feedback: {}, // 反馈信息
    feedbackType: 'activity', // 反馈类型，'activity' 或 'club'
    reply: {
      content: '感谢您的反馈，请耐心等待回复。',
      time: ''
    }, // 默认回复信息
  },

  onLoad: function(options) {
    const feedback = JSON.parse(options.feedback); // 从上一页获取传递过来的反馈信息
    const feedbackType = feedback.activityId == 9 ? 'club' : 'activity'; // 获取反馈类型
    console.log("feedback:", feedback);

    // 设置页面数据
    this.setData({
      feedback: feedback,
      feedbackType: feedbackType
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: feedbackType === 'activity' ? '活动反馈详情' : '社团反馈详情'
    });

    // 获取回复
    this.getReply(feedback.id);

    // 获取关联活动
    if (feedbackType === 'activity') {
      this.getRelatedActivity(feedback.activityId);
    }
  },

  getReply: function(feedbackId) {
    console.log("feedbackId:",feedbackId)
    const that = this;
    wx.request({
      url: `http://localhost:9091/api/activity/replies/feedback/${feedbackId}`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200 && res.data) {
          const reply = res.data;
          console.log("reply!!", reply)
          that.setData({
            reply: {
              content: reply.replyContent,
              time: new Date(reply.replyTime).toLocaleDateString('zh-CN')
            }
          }, () => {
            // 这个回调函数将在数据设置完成后执行
            console.log("this.reply!", that.data.reply)
          });
        } else {
          // wx.showToast({
          //   title: '暂无回复，请耐心等待。',
          //   icon: 'none'
          // });
          // console.log("无回复")
          that.setData({
            reply: {
              content: '暂无回复，请耐心等待。'
              // time: new Date(reply.replyTime).toLocaleDateString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            }
          });
        }
      },
      fail() {
        wx.showToast({
          title: '加载回复失败',
          icon: 'none'
        });
      }
    });
  },

  getRelatedActivity: function(activityId) {
    console.log("activityId!!:", activityId)
    const that = this;
    wx.request({
      url: `http://localhost:9091/api/activity/activities/${activityId}`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200) {
          const activity1 = res.data;
          console.log("获取活动成功", activity1);
          that.setData({
            // feedback: {
            //   // ...that.data.feedback, // 保留 feedback 的其他属性
            //   activity: activity1.title // 仅更新 activity 属性
            // }
            activity: activity1.title // 仅更新 activity 属性
          });
          console.log("更新反馈成功！", that.data.feedback)
        } else {
          wx.showToast({
            title: '加载活动信息失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '加载活动信息失败',
          icon: 'none'
        });
      }
    });
  }
});
