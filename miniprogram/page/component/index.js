Page({
  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})

    // http://tapd.oa.com/miniprogram_experiment/prong/stories/view/1020425689866413543
    if (wx.canIUse('getExptInfoSync')) {
      console.log('getExptInfoSync expt_args_1', wx.getExptInfoSync(['expt_args_1']))
      console.log('getExptInfoSync expt_args_2', wx.getExptInfoSync(['expt_args_2']))
      console.log('getExptInfoSync expt_args_3', wx.getExptInfoSync(['expt_args_3']))
    }
    if (wx.canIUse('reportEvent')) {
      wx.reportEvent('expt_event_1', {expt_data: 1})
      wx.reportEvent('expt_event_2', {expt_data: 5})
      wx.reportEvent('expt_event_3', {expt_data: 9})
      wx.reportEvent('expt_event_4', {expt_data: 200})

      wx.reportEvent('weexpt_event_key_1', {option_1: 1, option_2: 10, option_str_1: 'abc'})
      wx.reportEvent('weexpt_event_key_1', {option_1: 'abc', option_2: '1000', option_str_1: '1'})
    }
  },
  onShareAppMessage() {
    return {
      title: 'Black Eight',
      path: 'page/component/index'
    }
  },
  onShareTimeline() {
    '小程序官方组件展示'
  },

  data: {
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper', 'movable-view', 'cover-view']
      }, {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['text', 'icon', 'progress', 'rich-text']
      }, {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea', 'editor']
      }, {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator']
      }, {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'video', 'camera', 'live-pusher', 'live-player']
      }, {
        id: 'map',
        name: '地图',
        open: false,
        pages: ['map', { appid: 'wxe3f314db2e921db0', name: '腾讯位置服务示例中心'}]
      }, {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: ['canvas-2d', 'webgl']
      }, {
        id: 'open',
        name: '开放能力',
        open: false,
        pages: ['ad', 'open-data', 'web-view']
      }, {
        id: 'obstacle-free',
        name: '无障碍访问',
        open: false,
        pages: ['aria-component']
      }
    ],
    theme: 'light',
    player1: {
      name: '主场选手',
      score: 0
    },
    player2: {
      name: '客场选手',
      score: 0
    },
    totalGames: 9,
    isLandscape: false
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    });

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme});
      });
    }

    // 启动自动刷新
    this.startAutoRefresh();
  },

  onUnload() {
    // 清除自动刷新定时器
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },

  // 自动刷新功能
  startAutoRefresh() {
    this.refreshTimer = setInterval(() => {
      // TODO: 实现刷新逻辑
      console.log('自动刷新')
    }, 30000) // 30秒刷新一次
  },

  // 增加分数
  addScore(e) {
    const player = e.currentTarget.dataset.player
    const key = player === 'player1' ? 'player1.score' : 'player2.score'
    const currentScore = player === 'player1' ? this.data.player1.score : this.data.player2.score
    const newScore = currentScore + 1
    
    // 先更新分数
    this.setData({
      [key]: newScore
    })
    
    // 计算获胜需要的局数（过半数）
    const totalGames = parseInt(this.data.totalGames)
    const requiredWins = Math.ceil(totalGames / 2)
    
    console.log('当前分数:', newScore)
    console.log('需要获胜局数:', requiredWins)
    console.log('总局数:', totalGames)
    
    // 检查是否达到获胜条件（达到过半数）
    if (newScore >= requiredWins) {
      console.log('达到获胜条件')
      const winner = player === 'player1' ? '主场选手' : '客场选手'
      const otherPlayerScore = player === 'player1' ? this.data.player2.score : this.data.player1.score
      
      wx.showModal({
        title: '比赛结束',
        content: `恭喜${winner}获胜！\n已获得${newScore}局，率先达到${requiredWins}局。`,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.resetGame()
          }
        }
      })
    }
  },

  // 减少分数
  minusScore(e) {
    const player = e.currentTarget.dataset.player
    const key = player === 'player1' ? 'player1.score' : 'player2.score'
    const currentScore = player === 'player1' ? this.data.player1.score : this.data.player2.score
    
    if (currentScore > 0) {
      this.setData({
        [key]: currentScore - 1
      })
    }
  },

  // 切换横屏
  switchScreen() {
    this.setData({
      isLandscape: !this.data.isLandscape
    });
  },

  // 重置比分
  resetGame() {
    this.setData({
      'player1.score': 0,
      'player2.score': 0
    })
  },

  // 邀请好友
  inviteFriend() {
    // TODO: 实现邀请好友逻辑
  },

  // 添加虚拟球友
  addVirtualPlayer() {
    // TODO: 实现添加虚拟球友逻辑
  },

  // 删除球友
  deletePlayer() {
    // TODO: 实现删除球友逻辑
  },

  // 结束比赛
  endGame() {
    // TODO: 实现结束比赛逻辑
  },

  // 查看明细
  showDetails() {
    // TODO: 实现查看明细逻辑
  },

  // 返回
  goBack() {
    // TODO: 实现返回逻辑
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
  },

  onTotalGamesChange(e) {
    let value = e.detail.value;
    
    // 如果输入为空，直接返回
    if (value === '') {
      return;
    }
    
    // 转换为数字
    value = parseInt(value);
    
    // 确保输入的是有效数字
    if (isNaN(value)) {
      value = 9;
    }
    
    // 限制最大值为99，最小值为1
    value = Math.min(Math.max(value, 1), 99);
    
    console.log('修改总局数为:', value);
    
    this.setData({
      totalGames: value,
      // 重置比分
      'player1.score': 0,
      'player2.score': 0
    });
  },

  onTotalGamesBlur(e) {
    let value = this.data.totalGames;
    
    // 如果为空或无效，设置为默认值9
    if (!value || value < 1) {
      value = 9;
    }
    
    this.setData({
      totalGames: value,
      'player1.score': 0,
      'player2.score': 0
    });
  },
})
