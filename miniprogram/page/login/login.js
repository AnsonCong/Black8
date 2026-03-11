Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  // 处理登录
  handleLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 获取到登录凭证 code
          console.log('登录成功，code:', res.code);
          // TODO: 这里需要把 code 发送到你的后端服务器
          // 后端拿到 code 后，调用微信接口换取 openid 和 session_key
          wx.request({
            url: 'YOUR_SERVER_URL/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (response) => {
              // 保存后端返回的用户信息和登录态
              wx.setStorageSync('token', response.data.token);
              wx.setStorageSync('userInfo', response.data.userInfo);
              
              // 跳转到首页或其他页面
              wx.switchTab({
                url: '/page/component/index'
              });
            },
            fail: (err) => {
              console.error('登录失败:', err);
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            }
          });
        } else {
          console.error('登录失败:', res.errMsg);
        }
      }
    });
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // 调用登录接口
        this.handleLogin();
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
      }
    });
  }
}) 