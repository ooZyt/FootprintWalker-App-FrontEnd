// form.js
Page({
  data: {
    studentID: '',
    name: '',
    contact: ''
  },

  handleInput: function(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  handleSubmit: function() {
    const { studentID, name, contact } = this.data;
    if (!studentID || !name || !contact) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
    

    // 可以在这里提交表单数据到服务器
  }
});
