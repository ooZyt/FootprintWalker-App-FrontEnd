Page({
  data: {
    activityFeedbacks: [
      {
        id: 1,
        title: '关于千岛湖游玩',
        content: '反馈的内容非常丰富，涉及到很多方面...',
        time: '2023-05-16 08:00',
        status: 'processed'
      },
      {
        id: 2,
        title: '关于黄山徒步',
        content: '反馈的内容非常丰富，涉及到很多方面...',
        time: '2023-06-11 09:00',
        status: 'unprocessed'
      }
    ],
    clubFeedbacks: [
      {
        id: 3,
        title: '社团反馈标题',
        content: '社团反馈的内容非常丰富，涉及到很多方面...',
        time: '2023-06-12 10:00',
        status: 'processed'
      },
      {
        id: 4,
        title: '社团反馈标题2',
        content: '社团反馈的内容非常丰富，涉及到很多方面...',
        time: '2023-07-01 11:00',
        status: 'unprocessed'
      }
    ],
    feedbackType: 'activity',
    sortOrder: 'desc',
    orderButtonText: '按时间降序'
  },
  switchFeedbackType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      feedbackType: type
    });
  },
  toggleFeedbackType(e) {
    const type = e.detail.value ? 'activity' : 'club';
    this.setData({
      feedbackType: type
    });
  },
  toggleOrder: function() {
    const newSortOrder = this.data.sortOrder === 'desc' ? 'asc' : 'desc';
    this.setData({
      sortOrder: newSortOrder
    });
    this.sortFeedbacks(newSortOrder);
    this.setOrderButtonText(newSortOrder);
  },
  setOrderButtonText: function(order) {
    const buttonText = order === 'desc' ? '按时间降序' : '按时间升序';
    this.setData({
      orderButtonText: buttonText
    });
  },
  sortFeedbacks: function(order) {
    let feedbacks = [];
    if (this.data.feedbackType === 'activity') {
      feedbacks = this.data.activityFeedbacks;
    } else {
      feedbacks = this.data.clubFeedbacks;
    }
    feedbacks.sort((a, b) => {
      if (order === 'desc') {
        return new Date(b.time) - new Date(a.time);
      } else {
        return new Date(a.time) - new Date(b.time);
      }
    });
    if (this.data.feedbackType === 'activity') {
      this.setData({
        activityFeedbacks: feedbacks
      });
    } else {
      this.setData({
        clubFeedbacks: feedbacks
      });
    }
  },
  onLoad: function() {
    this.setOrderButtonText(this.data.sortOrder);
    this.sortFeedbacks(this.data.sortOrder);
  },
  viewFeedback: function (event) {
    const feedbackId = event.currentTarget.dataset.id;
    let feedback = null;
    if (this.data.feedbackType === 'activity') {
      feedback = this.data.activityFeedbacks.find(item => item.id === feedbackId);
    } else {
      feedback = this.data.clubFeedbacks.find(item => item.id === feedbackId);
    }
    // 跳转到反馈详情页面，并传递反馈信息
    wx.navigateTo({
      url: '/pages/feedback/feedback-detail/index?feedback=' + JSON.stringify(feedback)
    });
  },
  gotoClubFeedback: function() {
    wx.navigateTo({
      url: '/pages/feedback/club-feedback/index'
    });
  },
  gotoActivityFeedback: function() {
    wx.switchTab({
      url: '/pages/feedback/activity-feedbacks/index'
    });
  },
  toggleActivityFeedback() {
    this.setData({
      feedbackType: 'activity'
    });
  },
  toggleClubFeedback() {
    this.setData({
      feedbackType: 'club'
    });
  }
});
