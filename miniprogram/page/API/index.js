Page({
  data: {
    theme: 'light'
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  },

  onShareAppMessage() {
    return {
      title: 'Black Eight',
      path: 'page/API/index'
    }
  }
})