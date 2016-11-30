var app = getApp();
Page({
    data:{
        wechatUserInfo:{},
        scrollHeight:150,
        imageWidth:125,
        imageHeight:125,
        photoList:[],
        location:"选择我的位置",
        array: ['拼车','取快递', '带文件', '租房','健身指导', '其他'],
        index: 0,
        date:"2016-09-01",
        time:"12:01",
        curtype: "请选择",
    },
    addAndSavePhoto:function(){
        console.log("从本地选取照片");
        var that = this;
        var showFileList = that.data.photoList;
        wx.chooseImage({
          count: 9, // 最多可以选择的图片张数，默认9
          sizeType: ['original','compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function(res){
            // 后台慢慢保存文件到本地      
            res.tempFilePaths.forEach(function(tempFilePath){
                // 调用保存到本地的API
                wx.saveFile({
                  tempFilePath: tempFilePath,
                  success: function(res){
                    console.log("保存到本地的文件路径："+res.savedFilePath);
                    showFileList.push(res.savedFilePath);
                    // 更新页面显示
                    console.log(showFileList.length+"个展示图片");
                    that.setData({
                        photoList:showFileList
                    });
                  }
                })
            }); 
          }
        });
    },
    previewPhoto:function(event){
        console.log(event);
        var curTarget = event.target.dataset.imageSrc;
        console.log(curTarget);
        wx.navigateTo({
          url: '../previewphoto/previewphoto?imagepath='+curTarget
        })
 /*       wx.previewImage({
          current: curTarget, // 当前显示图片的链接，不填则默认为 urls 的第一张
          urls: this.data.photoList,
          success: function(res){
            // success
            console.log(res);
          }
        }) */
    },
    twoColomn:function(){
        var that = this;
        var length = 750/2;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    threeColomn:function(){
        var that = this;
        var length = 750/3;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    fourColomn:function(){
        var that = this;
        var length = 750/4;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var that = this;
        var i=e.detail.value; 
        that.setData({
        index: i,
            curtype:that.data.array[i]
        });
        console.log("123")
    },
    bindDateChange:function(e){
        this.setData({
            date:e.detail.value
        })
    },

    chooseLocation:function(){
        var that = this;
        wx.chooseLocation({
            type: 'wgs84',
            success: function(res) {
                var latitudeCur = res.latitude;
                var longitudeCur = res.longitude;
                var name = res.name;
                var address = res.address;
                console.log(name);
                that.setData({
                    location:name,
                    latitude:latitudeCur,
                    longitude:longitudeCur
                })
            }
        });
    },

    onLoad:function(){
        console.log("加载照片列表");
        var that = this;
        //获取用户信息
        app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
                wechatUserInfo:userInfo
            });
            //that.update();
        })
        // 获取当前窗口高度，以便设置scrollView的高度
        wx.getSystemInfo({
          success: function(res) {
            console.log(res.model);
            console.log(res.pixelRatio);
            console.log(res.windowWidth);
            console.log(res.windowHeight);
            console.log(res.version);
            that.setData({
                scrollHeight:res.windowHeight/8
            });
          }
        });
        //获取当前时间
        var timeStr =new Date;
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
            }

        function formatTime(time) {
            var hour = time.getHours()
            var minute = time.getMinutes()
            var second = time.getSeconds()
           
            return [hour, minute].map(formatNumber).join(':')
            }

        function formatDate(date) {
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()

            return [year, month, day].map(formatNumber).join('-')
            }

        var dateNow=formatDate(timeStr);
        // var timeNow=formatTime(timeStr);
        that.setData({
                date:dateNow,
                // time:timeNow
            });

            
    },

    formSubmit: function(e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var formData=e.detail.value;
        var reqData={};
        reqData.userId=that.data.wechatUserInfo.nickName;
        reqData.longitude=that.data.longitude;
        reqData.latitude=that.data.latitude;
        reqData.srvType=that.data.curtype;
        reqData.srvTitle=formData.title;
        reqData.srvDesc=formData.describe;
        reqData.srvCost=formData.score;
        reqData.endTime=formData.date+" 00:00:00";
        reqData.urgent=formData.isquickly;
        reqData.mobile=formData.phonenumber;
        reqData.posDes=that.data.location;
        wx.request({
            url: 'https://api.getweapp.com/vendor/lezhu/postNeed', //接口地址
            data: reqData,
            method:"POST",
            header: {
                'content-type': 'application/json',
                "dataType":"json"
            },
            success: function(res) {
                if (res.data.respCode){
                    if(res.data.respCode==0){
                        wx.showModal({
                            title: '提示',
                            content: '求助信息提交成功！',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url:"../helpList/helpList"
                                    });
                                }
                            }
                        });
                    }
                    else if(res.data.respCode==1){
                        wx.showModal({
                            title: '提示',
                            content: '求助信息提交失败!',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        });
                    }
                }
                else{
                    wx.showModal({
                        title: '提示',
                        content: '求助信息提交失败!',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    });
                }
            },
            fail: function() {
                wx.showModal({
                    title: '提示',
                    content: '提交失败!',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                });
            }
        });
    },
    onShow:function(){
        console.log("显示图片")
        // 获取本地保存的图片
        var that = this;
        wx.getSavedFileList({
          success: function(res){
            // success
            console.log(res.errMsg);
            console.log(res.fileList.length+"个本地文件");
            var filePathList=[];
            res.fileList.forEach(function(item){
                filePathList.push(item.filePath);
                // 删除本地文件
 /*               wx.removeSavedFile({
                  filePath: item.filePath,
                  complete: function(res){
                    // success
                    console.log(res);
                  }
                })   */
            });
            that.setData({
                photoList:filePathList
            });
          },
          fail:function(){
              // 失败 wx.showToast
              wx.showToast({
                  title:"获取本地图片失败！",
                  duration: 2000
              });
          }
        })
    }
})