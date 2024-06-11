Page({
    data: {
      
    },
  
    swichNav(e) {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      });
    }
  });
  