// pages/setout/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: null,
    activityDetails: {},
    advisorMsg: "<p>在大家反馈中出现频率最高的千岛湖之旅它来啦！走过路过不要错过哦~</p>",
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    showModal: false, //点击报名显示弹窗
    informMsg:"<p>1. 本社团所有活动采取<strong>自愿参加、费用自理、责任自担</strong>的原则：参与者应为<strong>年满18岁、具有完全民事行为能力的自然人</strong>（未年满18岁的人员须告知家长相关活动内容并经由家长同意），自愿接受并遵守活动发布内容中的规则和事项。</p><p>2. 活动参与者在活动中，应听从领队及工作人员的带领。活动参与者若发生意外，其后果由参与者<strong>自行独自承担</strong>。领队人员有因天气或其他安全因素取消或调整线路的权力。<p><div style='color: red;'>请确认仔细阅读并理解上述声明的全部内容，接受声明所列条款，愿意承担相关责任，自愿参加本次活动。</div>"
  },
  onLoad: function (options) {
    console.log('Page loaded with options:', options.id);
    const { id } = options;
    this.setData({
      activityId: id
    });
    
    // 在这里调用函数获取活动详情
    this.fetchActivityDetails(id);
  },
  fetchActivityDetails: function (id) {
    // 假设您有一个获取活动详情的接口
    console.log(id);
    wx.request({
      url: `http://localhost:9091/api/activity/activities/1`, // 根据实际情况替换 URL
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        //格式化日期
        res.data.startTime = this.formatDateToSlash(res.data.startTime);
        res.data.endTime = this.formatDateToSlash(res.data.endTime);


        if (res.statusCode === 200) {
          console.log(res.data);
          this.setData({
            activityDetails: res.data
          });
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
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
    // 滚动至对应区域
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

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

  },

  /*活动须知弹窗*/
  showDialog: function() {
    this.setData({
      showModal: true
    });
  },

  hideDialog: function() {
    this.setData({
      showModal: false
    });
  },

  accept: function() {
    this.setData({
      showModal: false
    });
    wx.showToast({
      title: '报名成功',
      icon: 'none',
      duration: 2000
    });
  },

  reject: function() {
    this.setData({
      showModal: false
    });
    wx.showToast({
      title: '已拒绝',
      icon: 'none',
      duration: 2000
    });
  }
});