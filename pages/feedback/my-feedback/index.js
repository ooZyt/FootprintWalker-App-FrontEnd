Page({
  data: {
    activityFeedbacks: [],
    clubFeedbacks: [],
    filteredActivityFeedbacks: [],
    filteredClubFeedbacks: [],
    feedbackType: 'activity',
    sortOrder: 'desc',
    orderButtonText: '按时间降序',
    searchKeyword: ''
  },
  
  onLoad: function() {
    this.setOrderButtonText(this.data.sortOrder);
    this.loadFeedbacks();
  },
  
  loadFeedbacks: function() {
    const that = this;
    wx.getStorage({
      key: 'userId',
      success(res) {
        const userId = res.data;
        wx.request({
          url: `http://localhost:9091/api/activity/feedbacks/user/${userId}`,
          method: 'GET',
          success(response) {
            if (response.statusCode === 200) {
              const feedbacks = response.data.map(feedback => ({
                id: feedback.feedbackID,
                title: feedback.title,
                content: feedback.feedbackContent,
                time: new Date(feedback.feedbackTime).toLocaleDateString('zh-CN'),
                status: feedback.feedbackStatus,
                activityId: feedback.activityId,
                rating: feedback.rating
              }));
              const activityFeedbacks = feedbacks.filter(fb => fb.activityId !== 9);
              const clubFeedbacks = feedbacks.filter(fb => fb.activityId === 9);
              
              that.setData({
                activityFeedbacks,
                clubFeedbacks,
                filteredActivityFeedbacks: activityFeedbacks,
                filteredClubFeedbacks: clubFeedbacks
              });
              that.sortFeedbacks(that.data.sortOrder);
            } else {
              wx.showToast({
                title: '加载反馈失败',
                icon: 'none'
              });
            }
          },
          fail() {
            wx.showToast({
              title: '加载反馈失败',
              icon: 'none'
            });
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
  },
  
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
  
  searchFeedbacks: function() {
    const keyword = this.data.searchKeyword.toLowerCase();
    const filteredActivityFeedbacks = this.data.activityFeedbacks.filter(feedback =>
      feedback.title.toLowerCase().includes(keyword)
    );
    const filteredClubFeedbacks = this.data.clubFeedbacks.filter(feedback =>
      feedback.title.toLowerCase().includes(keyword)
    );
    this.setData({
      filteredActivityFeedbacks,
      filteredClubFeedbacks
    });
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
      feedbacks = this.data.filteredActivityFeedbacks;
    } else {
      feedbacks = this.data.filteredClubFeedbacks;
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
        filteredActivityFeedbacks: feedbacks
      });
    } else {
      this.setData({
        filteredClubFeedbacks: feedbacks
      });
    }
  },
  
  viewFeedback: function(event) {
    const feedbackId = event.currentTarget.dataset.id;
    let feedback = null;
    if (this.data.feedbackType === 'activity') {
      feedback = this.data.filteredActivityFeedbacks.find(item => item.id === feedbackId);
    } else {
      feedback = this.data.filteredClubFeedbacks.find(item => item.id === feedbackId);
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
