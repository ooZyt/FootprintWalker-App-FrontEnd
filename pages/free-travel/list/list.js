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
    currentFilter: 'all', // 当前活动过滤器状态
    fetcheddata:[],
    activities:[],
    searchKeyword: '' // 用户输入的关键词
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
  FetchNowActivities: function () {
    const activities = this.data.fetcheddata.filter(activity => activity.activityStatus === 'PUBLISHED');
    this.setData({
      activities: activities,
      currentFilter: 'now'
    });
  },
  FetchBeforeActivities: function () {
    const activities = this.data.fetcheddata.filter(activity => activity.activityStatus === 'RETROSPECTIVE');
    this.setData({
      activities: activities,
      currentFilter: 'before'
    });
  },
  fetchActivities: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:9091/api/activity/activities', // 接口地址
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.statusCode === 200) {
          console.log('Fetched activities:', res.data); // 输出到控制台
          const formattedData = res.data.map(activity => {
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

  searchActivities: function () {
    const keyword = this.data.searchKeyword.toLowerCase();
    let activities = this.data.fetcheddata.filter(activity => activity.title.toLowerCase().includes(keyword));
    
    if (this.data.currentFilter === 'now') {
      activities = activities.filter(activity => activity.activityStatus === 'PUBLISHED');
    } else if (this.data.currentFilter === 'before') {
      activities = activities.filter(activity => activity.activityStatus === 'RETROSPECTIVE');
    }
    
    this.setData({
      activities: activities
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
  // 显示搜索框
  showSearchModal(e) {
    this.setData({
      showModal: true
    })
  },
  // 隐藏搜索框
  hideSearchModal() {
    this.setData({
      showModal: false
    })
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