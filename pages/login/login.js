// pages/login/login.js
Page({

  data: {
    tabIndex: 0, //tab下标
    loginForm:{
      phoneNumber:"",
      password:""
    },
    codeForm:{
      verificationCode: "", //表单中展示的验证码
      contentText: "123", //向手机号发送的随机验证码
      timer: null,
      showCode: true, //判断展示‘获取验证码’或‘倒计时’
      count: "", //倒计时时间
    },
    contextCode:"",
    APIID:"C51421715",
    APIKEY:"5a0ed71266a542a0857819d931ba09af"
  },

  // tab点击
  tabClick: function(event) {
    this.setData({
      tabIndex : event.currentTarget.dataset.index
    })
  },

  // 注册
  register() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  findpassword(){
    wx.navigateTo({
      url: '/pages/findpassword/findpassword'
    })
  },

  // 一些工具函数
  onInputChange: function(event) {
    const field = event.currentTarget.dataset.field;  // 获取输入字段
    this.setData({
      [`loginForm.${field}`]: event.detail.value      // 动态更新对应字段
    });
  },

  getLoginPhoneCode(){
    // 如果未输入手机号，结束执行
    if (this.data.loginForm.phoneNumber == "") {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none',
        duration: 2000 // 提示框显示时间
      });
      return;
    }

    // 展示发送验证码
    wx.showToast({
      title: "获取验证码"
    })

    // 获取随机数（6位数字）
    let numCode = "";
    for (let i = 0; i < 6; i++) {
      numCode += Math.floor(Math.random() * 10);
    }
    // 存储发送的验证码,用于验证输入的手机验证码是否和本地存储的相同
    this.data.codeForm.contextCode = numCode;
    // 向手机号发送验证码传入的参数
    let phoneCode = {
      account: this.data.APIID,
      password: this.data.APIKEY,
      mobile: this.data.loginForm.phoneNumber,
      content: `您的验证码是：${numCode}。请不要把验证码泄露给其他人。`
    };

    //调用接口
    wx.request({
      url:`https://106.ihuyi.com/webservice/sms.php?method=Submit`,
      method: 'POST',
      data: phoneCode,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: "验证码发送失败！"
          })
          return;
        } else {
          // 当验证码发送成功，开始60秒倒计时
          const TIME_COUNT = 60;
          if (!this.data.codeForm.timer) {
            this.data.codeForm.showCode = false;
            this.data.codeForm.count = TIME_COUNT;
            this.data.codeForm.timer = setInterval(() => {
              if (
                  this.data.codeForm.count > 0 &&
                  this.data.codeForm.count <= TIME_COUNT
              ) {
                this.data.codeForm.count -= 1;
              } else {
                this.data.codeForm.showCode = true;
                clearInterval(this.data.codeForm.timer);
                this.data.codeForm.timer = null;
              }
            }, 1000);
          }
        }
      }
    })
  },

  // 登陆
  login(){
    let that = this

    wx.request({
      url: `http://localhost:8090/api/human_management/members/login`, // 根据实际情况换URL
      method: 'POST',
      data: that.data.loginForm,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if(res.statusCode === 200){
          console.log('Login successful', res.data);
          // 登录成功的处理逻辑，可以存储 token 等
          // 示例：存储 token 到本地缓存
          wx.setStorageSync('userId', res.data.id);
          // 示例：跳转到首页
          wx.switchTab({
            url: '/pages/home/list/index',
          })
        }
        else{
          wx.showToast({
            title: '登陆失败',
          })
          console.error('Login failed', res);
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
  }

})