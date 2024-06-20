// /pages/userinfo/userinfo
Page({
  data: {
    registerStyle: 0,        // 如果是0，代表是校内注册
    //用户填写的信息
    campus: "",              //用户校区
    telephone: "",           //用户电话
    email:"",                //用户邮箱
    verifyCode: "",          //验证码
    password: "",            //用户的密码
    verifyPassword: "",      //确认密码
    college: "",             //学院
    major: "",               //专业
    grade: "",               //年级
    name: "",                //用户昵称
    university:"",
    //获取当前时间和日期
    Time: "",                //当前时间
    date: "",                //当前日期

    instituteList : ['机械与能源学院', '生命科学与技术学院', '铁道与城市轨道交通研究院', '物理科学与工程学院', '建筑与城市规划学院', '汽车学院', '数学科学学院', '土木工程学院', '海洋与地球科学学院', '设计创意学院', '医学院', '新生院', '电子信息与工程学院', '法学院', '人文学院', '外国语学院', '环境科学与工程学院', '体育教学部', '艺术与传媒学院', '经济与管理学院', '马克思主义学院', '政治与国际关系学院', '中德工程学院', '测绘与地理信息学院', '航空航天与力学学院', '软件学院', '中德学院', '材料科学与工程学院', '化学科学与工程学院', '交通运输工程学院', '口腔医学院', '上海国际知识产权学院', '同济大学附属医院', '校医院'],

    gradeList : ['大一', '大二', '大三', '大四', '大五', '研一', '研二', '研三', '博士生及以上'],

    isOut : ['是','否']
  },

  onPickerIsOut: function(e) {
    const index = e.detail.value; // 获取选中的索引
    this.setData({
      registerStyle: index,
    });
  },

  onPickerCollege: function(e) {
    const index = e.detail.value; // 获取选中的索引
    this.setData({
      college: this.data.instituteList[index],
    });
  },

  onPickerGrade: function(e) {
    const index = e.detail.value; // 获取选中的索引
    this.setData({
      grade: this.data.gradeList[index],
    });
  },

  onInputChange: function(event) {
    const field = event.currentTarget.dataset.field;  // 获取输入字段
    this.setData({
      [`${field}`]: event.detail.value      // 动态更新对应字段
    });
  },

  mapGradeToLevel(grade) {
    const gradeMap = {
        '大一': 'U1',
        '大二': 'U2',
        '大三': 'U3',
        '大四': 'U4',
        '大五': 'U5',
        '研一': 'P1',
        '研二': 'P2',
        '研三': 'P3',
        '博士生及以上': 'D_plus'
    };
    return gradeMap[grade] || null; // 返回对应的枚举值或者null
},
mapCampusToEnum(campus) {
    const campusMap = {
        '四平路校区': 'SIPING',
        '嘉定校区': 'JIADING',
        '沪北校区': 'HUBEI',
        '沪西校区': 'HUXI'
    };
    return campusMap[campus] || null; // 返回对应的枚举值或者null
},
mapCollegeToInstitute(college) {
    const collegeMap = {
        '机械与能源学院': 'MECHANICAL_AND_ENERGY_ENGINEERING',
        '生命科学与技术学院': 'LIFE_SCIENCES_AND_TECHNOLOGY',
        '铁道与城市轨道交通研究院': 'RAIL_TRANSIT_RESEARCH_INSTITUTE',
        '物理科学与工程学院': 'PHYSICAL_SCIENCE_AND_ENGINEERING',
        '建筑与城市规划学院': 'ARCHITECTURE_AND_URBAN_PLANNING',
        '汽车学院': 'AUTOMOTIVE_COLLEGE',
        '数学科学学院': 'MATHEMATICAL_SCIENCES',
        '土木工程学院': 'CIVIL_ENGINEERING',
        '海洋与地球科学学院': 'MARINE_AND_EARTH_SCIENCES',
        '设计创意学院': 'DESIGN_AND_CREATIVE_COLLEGE',
        '医学院': 'MEDICAL_COLLEGE',
        '新生院': 'FRESHMAN_COLLEGE',
        '电子信息与工程学院': 'ELECTRONIC_INFORMATION_ENGINEERING',
        '法学院': 'LAW_SCHOOL',
        '人文学院': 'COLLEGE_OF_HUMANITIES',
        '外国语学院': 'SCHOOL_OF_FOREIGN_LANGUAGES',
        '环境科学与工程学院': 'ENVIRONMENTAL_SCIENCE_AND_ENGINEERING',
        '体育教学部': 'PHYSICAL_EDUCATION_DEPARTMENT',
        '艺术与传媒学院': 'ART_AND_MEDIA_COLLEGE',
        '经济与管理学院': 'ECONOMICS_AND_MANAGEMENT',
        '马克思主义学院': 'MARXISM_COLLEGE',
        '政治与国际关系学院': 'POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS',
        '中德工程学院': 'SINO_GERMAN_COLLEGE_OF_ENGINEERING',
        '测绘与地理信息学院': 'GEOMATICS_AND_GEOINFORMATION_COLLEGE',
        '航空航天与力学学院': 'AERONAUTICS_AND_ASTRONAUTICS',
        '软件学院': 'SOFTWARE_COLLEGE',
        '中德学院': 'SINO_GERMAN_COLLEGE',
        '材料科学与工程学院': 'MATERIALS_SCIENCE_AND_ENGINEERING',
        '化学科学与工程学院': 'CHEMICAL_SCIENCE_AND_ENGINEERING',
        '交通运输工程学院': 'TRANSPORTATION_ENGINEERING_COLLEGE',
        '口腔医学院': 'COLLEGE_OF_STOMATOLOGY',
        '上海国际知识产权学院': 'SHANGHAI_INTELLECTUAL_PROPERTY_COLLEGE',
        '同济大学附属医院': 'TONGJI_UNIVERSITY_AFFILIATED_HOSPITAL',
        '校医院': 'UNIVERSITY_HOSPITAL'
        // 注意：确保这些值与您后端定义的枚举值一致
    };
    return collegeMap[college] || null; // 返回对应的枚举值或者null
  },

  update(){
    // 本函数用来进行注册
    if(this.data.telephone===""){
      wx.showToast({
        title: '电话号码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 首先读取个人id
    const userId = wx.getStorageSync('userId');

    // 准备要发送的数据
    const memberData = {
      id: userId, 
      university: this.data.registerStyle == 0 ? "同济大学":null,
      level: this.mapGradeToLevel(this.data.grade), // 需要实现 mapGradeToLevel 方法
      campus: this.mapCampusToEnum(this.data.campus), // 需要实现 mapCampusToEnum 方法
      name: this.data.name,
      phoneNumber: this.data.telephone,
      email: this.data.email,
      password: this.data.password,
      institute: this.mapCollegeToInstitute(this.data.college), // 需要实现 mapCollegeToInstitute 方法
      major: this.data.major
    };

    wx.request({
      url: 'http://localhost:8090/api/human_management/members/'+userId,
      method: 'PUT',
      data: memberData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if(res.statusCode === 20){
          console.log('Update successful', res.data);
          // 登录成功的处理逻辑，可以存储 token 等
          // 示例：跳转到登陆页
          wx.navigateTo({
            url: '/pages/user/center/index',
          })
        }
        else{
          wx.showToast({
            title: '更改失败',
            icon: 'none',
            duration: 2000
          })
          console.error('Update failed', res);
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },

  onLoad(){
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
            this.setData({
              name:res.data.name,
              level:res.data.level,
              campus:res.data.campus,
              email:res.data.email,
              telephone:res.data.phoneNumber,
              instituteList:res.data.institute,
              major:res.data.major
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
    } 
    else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }

})