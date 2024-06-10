Page({
  data: {
    activities: [],
    filteredActivities: [],
    searchKeyword: '',
    onlyMyActivities: false,
    sortOrder: 'desc', // 排序方式，默认为降序
    sortButtonText: '按时间降序'
  },

  onLoad: function() {
    this.loadActivities();
    this.setSortButtonText(this.data.sortOrder);
  },

  loadActivities: function() {
    const that = this;
    wx.request({
      url: 'http://localhost:9091/api/activity/activities', // 接口地址
      method: 'GET',
      success(res) {
        if (res.statusCode === 200) {
          console.log(res.data);
          const activities = res.data.map(activity => ({
            id: activity.id,
            image: activity.adImages[0], // 假设有imageUrl字段
            title: activity.title,
            description: activity.description,
            time: new Date(activity.startTime).toLocaleDateString('zh-CN')
          })).filter(activity => activity.id !== 9); // 过滤掉 ID 为 9 的活动(社团反馈);

          that.setData({
            activities: activities,
            filteredActivities: activities
          });
          that.sortActivities(that.data.sortOrder); // 按照默认排序方式排序
        } else {
          wx.showToast({
            title: '加载活动失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '加载活动失败',
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

  searchActivities: function() {
    const keyword = this.data.searchKeyword.toLowerCase();
    const filtered = this.data.activities.filter(activity =>
      activity.title.toLowerCase().includes(keyword)
    );
    this.setData({
      filteredActivities: filtered
    });
  },

  toggleMyActivities(e) {
    const that = this;
    this.setData({
      onlyMyActivities: e.detail.value
    });

    if (e.detail.value) {
      wx.getStorage({
        key: 'userId',
        success(res) {
          const userId = res.data;
          wx.request({
            url: `http://localhost:9091/api/activity/activities/participant/${userId}`,
            method: 'GET',
            success(response) {
              if (response.statusCode === 200) {
                const activities = response.data.content.map(activity => ({
                  id: activity.id,
                  image: activity.adImages[0],
                  title: activity.title,
                  description: activity.description,
                  time: new Date(activity.startTime).toLocaleDateString('zh-CN')
                }));

                that.setData({
                  activities: activities,
                  filteredActivities: activities
                });
                that.sortActivities(that.data.sortOrder);
              } else {
                wx.showToast({
                  title: '加载我的活动失败',
                  icon: 'none'
                });
              }
            },
            fail() {
              wx.showToast({
                title: '加载我的活动失败',
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
    } else {
      this.loadActivities();
    }
  },

  toggleOrder: function() {
    const newSortOrder = this.data.sortOrder === 'desc' ? 'asc' : 'desc';
    this.setData({
      sortOrder: newSortOrder
    });
    this.sortActivities(newSortOrder);
    this.setSortButtonText(newSortOrder);
  },

  setSortButtonText: function(order) {
    const buttonText = order === 'desc' ? '按时间降序' : '按时间升序';
    this.setData({
      sortButtonText: buttonText
    });
  },

  sortActivities: function(order) {
    const activities = this.data.filteredActivities;

    activities.sort((a, b) => {
      if (order === 'desc') {
        return new Date(b.time) - new Date(a.time);
      } else {
        return new Date(a.time) - new Date(b.time);
      }
    });

    this.setData({
      filteredActivities: activities
    });
  },

  gotoFeedback: function(event) {
    const activityId = event.currentTarget.dataset.id;
    const activity = this.data.activities.find(item => item.id === activityId);

    console.log(activity);
    console.log('/pages/feedback/input-activity-feedback/index?activity=' + JSON.stringify(activity));

    wx.navigateTo({
      url: '/pages/feedback/input-activity-feedback/index?activity=' + JSON.stringify(activity)
    });
  },

  gotoClubFeedback: function() {
    wx.navigateTo({
      url: '/pages/feedback/club-feedback/index'
    });
  },

  gotoMyFeedback: function() {
    wx.redirectTo({
      url: '/pages/feedback/my-feedback/index',
    });
  }
});
