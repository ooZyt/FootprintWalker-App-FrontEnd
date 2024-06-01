Page({
    data: {
      tags: ["自然", "轻松", "轰趴", "团建"],
      title: "周末轰趴｜虽迟但到的千岛湖之约",
      dateTime: "2024.8.23-2024.8.25(2天1夜)",
      advisor: {
        avatar: "../../../images/avatar.jpeg",
        name: "段婷婷",
        slogan: "足迹行者社团活动部管理员"
      },
      advisorMsg: "这里放置顾问的消息内容。",
      tabs: ["行程安排", "活动费用"],
      currentTab: 0,
      schedule: [
        {
          day: "DAY1：前往千岛湖",
          date: "9.25",
          content: "在浙江淳安县有这么一处胜景..."
        },
        {
          day: "DAY2：出发！由布院之森",
          date: "9.26",
          content: "在日本国宝级导师的指导下，零距离学习三日味禅课程..."
        }
      ],
      expenses: [
        { item: "交通费", cost: "200元" },
        { item: "伙食费", cost: "100元" }
      ],
      totalCost: "总费用: 300元"
    },
  
    swichNav(e) {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      });
    }
  });
  