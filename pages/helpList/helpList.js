var app=getApp();
Page(
  {
  data: {
    wxUserInfo:null,
    latitudeCur:null,
    longitudeCur:null,
    typedata: "全部",
    urgent:"false",
    index: 0,
    typearray: ['全部','紧急','拼车','取快递','带文件','租房','健身指导', '其他'],
    array: [],
    hintFlag:true
  },

  openMap: function(e) {
    var infoObj=e.currentTarget.dataset;
    app.mapData.latitude=Number(infoObj.latitude);
    app.mapData.longitude=Number(infoObj.longitude);
    app.mapData.location=infoObj.location;
    app.mapData.nickName=infoObj.nickname;
    app.mapData.headIcon=infoObj.headicon;
    app.mapData.payScore=infoObj.payscore;
    app.mapData.title=infoObj.title;
    app.mapData.content=infoObj.content;
    app.mapData.taskId= infoObj.taskid;
    wx.navigateTo({
      url: '../helpDetail/helpDetail'
    })
  },
bindPickerChange: function(e) {
    var that = this;
    var i=e.detail.value; 
    that.setData({
      index: i,
      typedata:that.data.typearray[i]
    });
    if(i==1){
      if(that.data.typedata=="紧急"){
          that.sendReq("全部","true");
      }
      else{
          that.sendReq(that.data.typedata,"true");
      }
    }
    else{
      that.sendReq(that.data.typedata,"false");
    }
},

  sendReq:function(type,urgent){
    //发送请求
    var that = this;
    var reqData={};
    reqData.userId=that.data.wxUserInfo.nickName;
    reqData.longitude=that.data.longitudeCur;
    reqData.latitude=that.data.latitudeCur;
    reqData.srvType=type;
    reqData.urgent=urgent;

    wx.request({
    url: 'https://api.getweapp.com/vendor/lezhu/searchServiceNeeded', //接口地址
    data: reqData,
    method:"POST",
    header: {
        'content-type': 'application/json',
        "dataType":"json"
    },
    success: function(res) {
        if (res.data.length == 0){
              that.setData({
                  hintFlag:false,
                  array:res.data
              });
        }
        else{
            that.setData({
                hintFlag:true,
                array:res.data
            });
        }
    },
    fail: function() {
        that.setData({
          array:app.mockHelpList
        });
    }
    })
  },

  onLoad:function(options){
    //获取用户信息
      var that = this;
      app.getUserInfo(function(userInfo){
            that.setData({
                wxUserInfo:userInfo
            });
            that.checkFlag();
      });
    //定位
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          that.setData({
              latitudeCur:res.latitude,
              longitudeCur:res.longitude
          });
          that.checkFlag();
        }
    });
  },

  checkFlag:function(){
    if(this.data.wxUserInfo&&this.data.latitudeCur&&this.data.longitudeCur){
      if(this.data.typedata == "紧急"){
        this.sendReq("全部","true");
      }
      else{
        this.sendReq(this.data.typedata,"false");
      }
    }
  },

  onShow:function(){
      //获取用户信息
      var that = this;
      app.getUserInfo(function(userInfo){
            that.setData({
                wxUserInfo:userInfo
            });
            that.checkFlag();
      });
      //定位
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          that.setData({
              latitudeCur:res.latitude,
              longitudeCur:res.longitude
          });
          that.checkFlag();
        }
      });
    }
})