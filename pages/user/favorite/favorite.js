// pages/setout/list/index.js
//仍然存在问题：无法在进入页面时直接调用接口，怪
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    showModal: false,   
    fetcheddata:[],
    activities:[],
  },
 
  onShow() {
    console.log('onShow')
    this.fetchActivities();
  },
  handleFetchActivities: function () {
    this.fetchActivities();
    this.setData({
      currentFilter: 'all'
    });
  },
  fetchActivities: function () {
    var that = this;
    const userId = wx.getStorageSync('userId');
    wx.request({
      url: `http://localhost:9091/api/activity/activities/favorite/${userId}`, // 接口地址
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.statusCode === 200) {
          console.log('Fetched activities:', res.data); // 输出到控制台
          const formattedData = res.data.content.map(activity => {
            activity.startTime = that.formatDateToSlash(activity.startTime);
            activity.endTime = that.formatDateToSlash(activity.endTime);
            return activity;
          });
          that.setData({
            fetcheddata: formattedData,
            activities: formattedData.filter(activity => activity.activityStatus !== 'DRAFT')
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
  onInputChange: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
   
  // 滚动切换标签样式
  switchTab(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkPosition();
  },
  // 点击标题切换当前页时改变样式
  swichNav(e) {
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    // 获取列表数据
    this.loadList(cur);
  },
  // 获取列表数据
  loadList: function(i) {},
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkPosition: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  // 大概在这里 有onLoad和onSHow ,

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})