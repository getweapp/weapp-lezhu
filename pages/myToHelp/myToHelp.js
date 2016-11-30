var app = getApp();
Page({
    data: {
        wechatUserInfo:{},
        toHelpArray:[],
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
            url: 'https://api.getweapp.com/vendor/lezhu/searchMyService',
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
                        toHelpArray:resp.data
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
            toHelpArray:app.mockToHelpArray
        });
    },
})