Page({
  data: {
    club: {
      avatar: '/images/club.png', // 社团头像
      description: '对社团有任何疑问或建议都可以写在这里~' // 社团介绍
    },
    currentRating: 0, // 初始化当前评分值
    feedbackTitle: '', // 初始化反馈标题
    feedbackContent: '' // 初始化反馈内容
  },

  onLoad: function() {
    // 你可以在这里加载任何需要的数据
  },

  setRating: function(event) {
    const index = event.currentTarget.dataset.index; // 获取点击的星星索引
    this.setData({
      currentRating: index + 1
    });
  },

  bindTitleInput: function(e) {
    this.setData({
      feedbackTitle: e.detail.value
    });
  },

  bindContentInput: function(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
  },

  submitFeedback: function(event) {
    const that = this;
    // 获取用户输入的反馈信息
    const title = this.data.feedbackTitle;
    const content = this.data.feedbackContent;
    const rating = this.data.currentRating; // 获取当前评分值
  
    // 获取当前用户ID
    wx.getStorage({
      key: 'userId',
      success(res) {
        const userId = res.data;
        const feedbackData = {
          feedbackID: 0, // 默认ID
          feedbackType: 'SUGGESTION',
          feedbackTime: new Date().toISOString(), // 使用ISO格式时间
          feedbackContent: content,
          feedbackStatus: 'PENDING',
          activityId: 9, // 社团反馈的 activity_id 固定为 9
          title: title,
          rating: rating,
          userId: userId, // 使用从本地存储中获取的用户ID
          feedbackImages: [] // 如果有反馈图片，可以在这里添加
        };
  
        console.log('提交的反馈数据:', feedbackData);
  
        // 发送提交反馈的网络请求
        wx.request({
          url: 'http://localhost:9091/api/activity/feedbacks',
          method: 'POST',
          data: feedbackData,
          success(response) {
            if (response.statusCode === 200) {
              wx.showToast({
                title: '反馈提交成功',
                icon: 'success'
              });
              // 延迟2秒后跳转回上一页
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 2000);
            } else {
              wx.showToast({
                title: '反馈提交失败',
                icon: 'none'
              });
              console.error('提交反馈失败:', response);
            }
          },
          fail(error) {
            wx.showToast({
              title: '反馈提交失败',
              icon: 'none'
            });
            console.error('提交反馈请求失败:', error);
          }
        });
      },
      fail() {
        wx.showToast({
          title: '获取用户ID失败',
          icon: 'none'
        });
      }
    });
  }
});
