// pages/feedback/feedback.js
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
    orderAsc: true
  },
  goHome() {
    wx.navigateTo({
      url: '/pages/home/home'
    });
  },
  toggleMyActivities(e) {
    this.setData({
      onlyMyActivities: e.detail.value
    });
    // TODO: Filter activities based on participation
  },
  toggleOrder() {
    this.setData({
      orderAsc: !this.data.orderAsc
    });
    // TODO: Sort activities based on order
  },
  gotoFeedback: function(event) {
    // 获取点击的活动信息
    const activityId = event.currentTarget.dataset.id;
    const activity = this.data.activities.find(item => item.id === activityId);

    // console.log('/pages/input-activity-feedback/index?activity=' + JSON.stringify(activity))

    // 跳转到输入活动反馈页面，并传递活动信息
    wx.navigateTo({
      url: '/pages/input-activity-feedback/index?activity=' + JSON.stringify(activity)
    });
  }
});
