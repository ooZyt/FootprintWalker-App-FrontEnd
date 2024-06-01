Page({
  data: {
    activities: [
      {
        id: 1,
        image: '/images/activity-1.jpg',
        title: '千岛湖游玩',
        description: '一日游，游览千岛湖的美丽风景。',
        time: '2023-05-15 08:00'
      },
      {
        id: 2,
        image: '/images/activity-2.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10 09:00'
      },
      {
        id: 3,
        image: '/images/activity-1.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10 09:00'
      },
      {
        id: 4,
        image: '/images/activity-2.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10 09:00'
      },
      {
        id: 5,
        image: '/images/activity-1.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10 09:00'
      },
    ],
    onlyMyActivities: false,
    sortOrder: 'desc' // 排序方式，默认为降序
  },
  toggleMyActivities(e) {
    this.setData({
      onlyMyActivities: e.detail.value
    });
    // TODO: Filter activities based on participation
  },

  // 切换排序方式的事件处理函数
  toggleOrder: function() {
    // 切换排序方式
    const newSortOrder = this.data.sortOrder === 'desc' ? 'asc' : 'desc';
    this.setData({
      sortOrder: newSortOrder
    });

    // 根据新的排序方式重新排序活动信息数组
    this.sortActivities(newSortOrder);

    // 根据新的排序方式设置按钮文字
    this.setSortButtonText(newSortOrder);
  },

  // 设置排序按钮文字的函数
  setSortButtonText: function(order) {
    const buttonText = order === 'desc' ? '按时间降序' : '按时间升序';
    this.setData({
      sortButtonText: buttonText
    });
  },

  // 页面加载时设置按钮文字
  onLoad: function() {
    // 初始加载时设置按钮文字
    this.setSortButtonText(this.data.sortOrder);
  },
  // 对活动信息数组进行排序的函数
  sortActivities: function(order) {
    const activities = this.data.activities;

    activities.sort((a, b) => {
      // 根据时间字段排序，假设时间字段为 time
      if (order === 'desc') {
        return new Date(b.time) - new Date(a.time);
      } else {
        return new Date(a.time) - new Date(b.time);
      }
    });

    // 更新排序后的活动信息数组
    this.setData({
      activities: activities
    });
  },

  // 页面加载时加载活动信息
  // onLoad: function() {
  //   this.loadActivities();
  // },

  gotoFeedback: function(event) {
    // 获取点击的活动信息
    const activityId = event.currentTarget.dataset.id;
    const activity = this.data.activities.find(item => item.id === activityId);

    // 跳转到输入活动反馈页面，并传递活动信息
    wx.navigateTo({
      url: '/pages/feedback/input-activity-feedback/index?activity=' + JSON.stringify(activity)
    });
  },
  gotoClubFeedback: function() {
    // 跳转到输入活动反馈页面，并传递活动信息
    wx.navigateTo({
      url: '/pages/feedback/club-feedback/index'
    });
  },
  gotoMyFeedback: function() {
    // 跳转到输入活动反馈页面，并传递活动信息
    // wx.navigateTo({
      wx.redirectTo({
      url: '/pages/feedback/my-feedback/index',
    });
  }
});
