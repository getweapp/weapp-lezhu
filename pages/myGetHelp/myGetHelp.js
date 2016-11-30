var app = getApp();
Page({
    data: {
        getHelpArray:[],
        wechatUserInfo:{},
        hintFlag:true
    },

    onLoad: function () {
        var that = this
  	    //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
                wechatUserInfo:userInfo
            });
            //that.update();
        })
    },

    onReady: function () {
        this.fetchData();
    },

    //获取数据
    fetchData:function(){
        var self = this;
        wx.request({
            url: 'https://api.getweapp.com/vendor/lezhu/searchMyNeed',
            header:{
                "contentType":"application/json",
                "dataType":"json"
            },
            data: {
                userId: self.data.wechatUserInfo.nickName,
            },
            method:"POST",
            success: function(resp) {
                if (resp.data.length == 0){
                    self.setData({
                        hintFlag:false
                    });
                }
                else{
                    self.setData({
                        getHelpArray:resp.data
                    });
                }
            },
            fail:function(resp){
                self.doMock();
            }
        });
    },

    doMock:function(){
        this.setData({
            getHelpArray:app.mockGetHelpArray
        });
    },

    //确认要Ta帮忙
    letHelpYes:function(e){
        var self = this;
        var idArray = (e.target.id).split("-");
        var num = idArray[0];
        var curr = self.data.getHelpArray[num];
        wx.request({
            url: 'https://api.getweapp.com/vendor/lezhu/confirmService',
            header:{
                "contentType":"application/json",
                "dataType":"json"
            },
            data: {
                taskId: curr.taskId,
                type:"0"
            },
            method:"POST",
            success: function(resp) {
                if (resp.data.respCode){
                    if (resp.data.respCode==0){
                        wx.showModal({
                            title: '提示',
                            content: '确认要Ta帮忙成功！',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 1
                                    });
                                }
                            }
                        });
                    }
                    else if (resp.data.respCode==1){
                        wx.showModal({
                            title: '提示',
                            content: '确认要Ta帮忙失败',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        });
                    }
                }
                else{
                    wx.showToast({
                        title: '已确认要Ta帮忙!',
                        icon: 'success',
                        duration: 3000,
                        success:function(){
                            self.mockProcessInfo(num);
                        }
                    });
                }
                
            },
            fail:function(resp){
                wx.showToast({
                    title: '已确认要Ta帮忙!',
                    icon: 'success',
                    duration: 2000,
                    success:function(){
                        self.mockProcessInfo(num);
                    }
                });
            }
        });
    },

    //确认不要Ta帮忙
    letHelpNo:function(e){
        var self = this;
        var idArray = (e.target.id).split("-");
        var num = idArray[0];
        var curr = self.data.getHelpArray[num];
        wx.request({
            url: 'https://wechatapp.zhhhorizon.net/intl-console-web/user/confirmService',
            header:{
                "contentType":"application/json",
                "dataType":"json"
            },
            data: {
                taskId: curr.taskId,
                type:"1"
            },
            method:"POST",
            success: function(resp) {
                if (resp.data.respCode){
                    if (resp.data.respCode==0){
                        wx.showModal({
                            title: '提示',
                            content: '不要Ta帮忙成功！',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 1
                                    });
                                }
                            }
                        });
                    }
                    else if (resp.data.respCode==1){
                        wx.showModal({
                            title: '提示',
                            content: '不要Ta帮忙失败',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        });
                    }
                }
                else{
                    wx.showToast({
                        title: '不要Ta帮忙成功！',
                        icon: 'success',
                        duration: 3000,
                        success:function(){
                            self.mockProcessInfo(num);
                        }
                    });
                }
                
            },
            fail:function(resp){
                wx.showToast({
                    title: '不要Ta帮忙成功！',
                    icon: 'success',
                    duration: 2000,
                    success:function(){
                        self.mockProcessInfo(num);
                    }
                });
            }
        });
    },

    //mockConfirm
    mockProcessInfo:function(num){
        var self = this;
        app.mockGetHelpArray[num].processInfo = 2;
        self.setData({
            getHelpArray:app.mockGetHelpArray
        });
    },

    //确认已经完成了帮助
    confirmFinish:function(e){
        var self = this;
        var num = e.target.id;
        var curr = self.data.getHelpArray[num];
        var point = curr.srvCost;
        wx.request({
            url: 'https://wechatapp.zhhhorizon.net/intl-console-web/user/confirmServiceComplete',
            header:{
                "contentType":"application/json",
                "dataType":"json"
            },
            data: {
                taskId: curr.taskId ,
            },
            method:"POST",
            success: function(resp) {
                if (resp.data.respCode){
                    if (resp.data.respCode==0){
                        wx.showModal({
                            title: '提示',
                            content: '给Ta悬赏成功！',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 1
                                    });
                                }
                            }
                        });
                    }
                    else if (resp.data.respCode==1){
                        wx.showModal({
                            title: '提示',
                            content: '给Ta悬赏失败！',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        });
                    }
                }
                else{
                    wx.showToast({
                        title: '帮助已完成，悬赏已送Ta!',
                        icon: 'success',
                        duration: 2000,
                        success:function(){
                            self.mockProcessInfoComplete(num,point);
                        }
                    });
                }
                
            },
            fail:function(resp){
                wx.showToast({
                    title: '帮助已完成，悬赏已送Ta!',
                    icon: 'success',
                    duration: 2000,
                    success:function(){
                        self.mockProcessInfoComplete(num,point);
                    }
                });
            }
        });
    },

    //mockComplete
    mockProcessInfoComplete:function(num,point){
        var self = this;
        app.mockGetHelpArray[num].processInfo = 3;
        app.mockUserInfo.usePoint -= point;
        self.setData({
            getHelpArray:app.mockGetHelpArray
        });
    },
})