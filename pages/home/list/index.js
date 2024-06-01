// pages/home/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [
      {
        id: 1,
        image: '/images/activity-1.jpg',
        title: '千岛湖游玩',
        description: '一日游，游览千岛湖的美丽风景。',
        time: '2023-05-15'
      },
      {
        id: 2,
        image: '/images/activity-2.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10'
      },
      {
        id: 3,
        image: '/images/home/huangshan.jpg',
        title: '黄山徒步',
        description: '挑战黄山的险峻，享受徒步的乐趣。',
        time: '2023-06-10'
      },

    ],
    onlyMyActivities: false,
    sortOrder: 'desc' // 排序方式，默认为降序
  },

  gotoDetail: function() {
    // 跳转到输入活动反馈页面，并传递活动信息
    wx.navigateTo({
      url: '/pages/home/detail/detail'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})