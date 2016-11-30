var app = getApp();
Page({
    data: {
    latitude: null,
    longitude: null,
    location:null,
    headIcon:null,
    nickName:null,
    phone:"",
    payScore:null,
    title:"",
    content:"",
    markers: [
 
    ],
    covers: [

    ]
  },
  takePhone:function(){
    var that=this;
    wx.makePhoneCall({
   phoneNumber:that.data.phone //仅为示例，并非真实的电话号码
})
  },
  onLoad: function (options) {
   var mobile=options.mobile;
    var that = this
  	//调用应用实例的方法获取全局数据
    that.setData({
    latitude: app.mapData.latitude,
    longitude: app.mapData.longitude,
    location: app.mapData.location,
    headIcon:app.mapData.headIcon,
    nickName:app.mapData.nickName,
    phone:mobile,
    payScore:app.mapData.payScore,
    title:app.mapData.title,
    content:app.mapData.content,
    covers:{
      latitude: app.mapData.latitude,
      longitude: app.mapData.longitude,
      iconPath: '../../images/map-location.png',
      rotate: 0
    }
    })
  }
})