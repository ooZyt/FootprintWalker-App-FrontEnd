// pages/user/center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userForm:{
      gender: "",
      name: "",
      level: "",
      campus: "",
      email: "",
      phoneNumber: "",
      institute: "",
      major: ""
    },
    avatarUrl: "https://jiyi-2023.oss-cn-shanghai.aliyuncs.com/avatar/default_avatar.png",
    cards: [
      // 一些示例
      // { imageUrl: '/images/card1.jpg', title: 'Card 1', description: 'Description 1' },
      // { imageUrl: '/images/card2.jpg', title: 'Card 2', description: 'Description 2' },
      // { imageUrl: '/images/card3.jpg', title: 'Card 3', description: 'Description 3' },
      // Add more card objects as needed
    ]
  },

  goToAboutus(){
    wx.navigateTo({
      url: '/pages/home/aboutUs/aboutUs',
    })
  },

  goToFavorite(){
    wx.navigateTo({
      url: '/pages/user/favorite/favorite',
    })
  },

  gotoUserInfo(){
    wx.navigateTo({
      url: '/pages/user/userinfo/userinfo',
    })
  },

  onCardTap(e) {
    const index = e.currentTarget.dataset.index;
    const cardId = this.data.cards[index].id;
    
    // 跳转到目标页面，携带卡片的相关信息
    wx.navigateTo({
      url: `/pages/free-travel/detail/index?id=${cardId}`,
    });
  },

  chooseImage() {
    wx.chooseMedia({
			count: 1, // 最多可以选择的文件个数
			mediaType: ['image'], // 文件类型
			sizeType: ['original'], // 是否压缩所选文件
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tempFilePaths = res.tempFiles;
        const userId = wx.getStorageSync('userId');
        // 显示上传中的提示
        wx.showLoading({
          title: '上传中...',
        });

        wx.uploadFile({
          url: 'http://localhost:8090/api/human_management/members/update_avatar',
          filePath: tempFilePaths[0].tempFilePath,
          name: 'file',
          formData: {
            'uploader': userId // 其他的表单数据
          },
          success: (res) => {
            wx.hideLoading(); // 隐藏上传中的提示
            if (res.statusCode === 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              });
              // 更新头像 URL
              this.setData({
                avatarUrl: tempFilePaths[0].tempFilePath
              });
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            wx.hideLoading(); // 隐藏上传中的提示
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
            console.error(err);
          }
        })
      }
    })
  },

  getMyParticipant(){
    const userId = wx.getStorageSync('userId');

    wx.request({
      url: 'http://localhost:9091/api/activity/activities/participant/'+userId,
      method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success:(res) => {
          console.log(res.data)
          if (res.statusCode === 200) {
            const cards = []
            res.data.content.forEach(item => {
              cards.push({
                id: item.id,
                title: item.title,
                path: item.adImages && item.adImages.length > 0 ? item.adImages[0] : '', // 确保 adImages 存在且不为空
                activityInfo: item.activityInfo
              });
            });
            this.setData({
              cards:cards
            })
          }
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cards: []
    })

    // 首先读取个人信息
    const userId = wx.getStorageSync('userId'); 

    if(userId){
      wx.request({
        url: 'http://localhost:8090/api/human_management/members/'+userId,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success:(res) => {
          if (res.statusCode === 200) {
            // 获取当前的 userForm 对象
            let userForm = this.data.userForm;

            // 更新 gender 属性
            userForm.gender = res.data.gender;
            userForm.name = res.data.name;
            userForm.level = res.data.level;
            userForm.campus = res.data.campus;
            userForm.email = res.data.email;
            userForm.phoneNumber = res.data.phoneNumber;
            userForm.institute = res.data.institute;
            userForm.major = res.data.major;

            this.setData({
              userForm: userForm
            })

            // 调用接口更改头像
            const avatarId = res.data.avatarId;
            wx.request({
              url: 'http://localhost:8090/api/human_management/members/upload/'+avatarId,
              method: 'GET',
              header: {
                'Content-Type': 'application/json'
              },
              success:(res) => {
                console.log(res.data)
                if (res.statusCode === 200) {
                  this.setData({
                    avatarUrl: res.data.path
                  })
                }
              }
            })
          }
          else{
            wx.showToast({
              title: '获取个人信息失败',
              icon: 'none',
              duration: 2000 // 提示框显示时间
            })
          }
        }
      })

      // 进行个人报名的获取
      this.getMyParticipant();
    } 
    else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }

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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
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

  }
})