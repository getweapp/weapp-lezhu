var app = getApp();
Page({
  data: {
    wechatUserInfo:{},
    latitude: null,
    longitude: null,
    location:null,
    headIcon:null,
    nickName:null,
    payScore:null,
    title:"",
    content:"",
    taskId:"",
    markers: [
  
    ],
    covers: [

    ]
    
  },
  helpClick:function(){
     var that = this;
        wx.showModal({
          title: '订单确认',
          content: '请尽快与发布者联系！',
          success: function(res) {
            if (res.confirm) {
              that.sendReq();
            }
          }
        })
  },
  sendReq:function(){
    //发送请求
    var that = this;
    var reqData={};
    reqData.taskId=that.data.taskId;
    reqData.helperId=that.data.wechatUserInfo.nickName;

    wx.request({
    url: 'https://api.getweapp.com/vendor/lezhu/acceptRequest', 
    method:"POST",
    data: reqData,
    header: {
        'content-type': 'application/json',
        "dataType":"json"
    },
    success: function(res) {
        if(res.data.status){
            if(res.data.status==0){
              wx.navigateTo({
                url: '../helpConfirmed/helpConfirmed?mobile='+res.data.mobile
              })
            }
            else if(res.data.status==1){
                wx.showModal({
                      title: '提示',
                      content: '确认失败',
                      success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                      }
                });
            }
        }
        else{
            wx.redirectTo({
              url: '../helpConfirmed/helpConfirmed?mobile=15825638889'
            })
        }
    },
    fail: function() {
      wx.redirectTo({
        url: '../helpConfirmed/helpConfirmed?mobile=15825638889'
      })
    }
    })
  },
  onLoad: function () {
    var that = this
  	//调用应用实例的方法获取全局数据
    that.setData({
      latitude: app.mapData.latitude,
      longitude: app.mapData.longitude,
      location: app.mapData.location,
      headIcon:app.mapData.headIcon,
      nickName:app.mapData.nickName,
      payScore:app.mapData.payScore,
      title:app.mapData.title,
      content:app.mapData.content,
      taskId:app.mapData.taskId,
      covers:{
        latitude: app.mapData.latitude,
        longitude: app.mapData.longitude,
        iconPath: '../../images/map-location.png',
        rotate: 0
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
            wechatUserInfo:userInfo
        });
        //that.update();
    })
  }
})