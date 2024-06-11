// pages/home/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // activities: [
    //   {
    //     id: 1,
    //     image: '/images/activity-1.jpg',
    //     title: '千岛湖游玩',
    //     description: '一日游，游览千岛湖的美丽风景。',
    //     time: '2023-05-15'
    //   },
    //   {
    //     id: 2,
    //     image: '/images/activity-2.jpg',
    //     title: '黄山徒步',
    //     description: '挑战黄山的险峻，享受徒步的乐趣。',
    //     time: '2023-06-10'
    //   },
    //   {
    //     id: 3,
    //     image: '/images/home/huangshan.jpg',
    //     title: '黄山徒步',
    //     description: '挑战黄山的险峻，享受徒步的乐趣。',
    //     time: '2023-06-10'
    //   },

    // ],
    // onlyMyActivities: false,
    // sortOrder: 'desc' // 排序方式，默认为降序

    activities:[],
  },

  gotoDetail: function() {
    // 跳转到输入活动反馈页面，并传递活动信息
    wx.navigateTo({
      url: '/pages/home/detail/detail'
    });
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchActivities();
  },

  fetchActivities: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:9091/api/activity/activities/popular', // 接口地址
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.statusCode === 200) {
          console.log('Fetched activities:', res.data); // 输出到控制台
          const topThreeActivities = res.data.slice(0, 3); // 只取前三条数据
          const formattedData = topThreeActivities.map((activity, index) => {
            activity.startTime = that.formatDateToSlash(activity.startTime);
            activity.endTime = that.formatDateToSlash(activity.endTime);
            activity.shortActivityInfo = activity.activityInfo.length > 20 ? activity.activityInfo.substring(0, 20) + "......" : activity.activityInfo;
            activity.orderId = index + 1; // 添加orderId字段
            return activity;
          });
          that.setData({
            fetcheddata: formattedData,
            activities: formattedData
          });
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  formatDateToSlash: function (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
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