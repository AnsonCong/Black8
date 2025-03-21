import CustomPage from './base/CustomPage'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'Black Eight',
      path: 'page/extend/index'
    }
  },
  data: {
    theme: 'light',
    player1Balls: [],
    player2Balls: [],
    player3Balls: [],
    player1Name: '球友1',
    player2Name: '球友2',
    player3Name: '球友3',
    player1Editing: false,
    player2Editing: false,
    player3Editing: false,
    player1Show: false,
    player2Show: false,
    player3Show: false
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
    // const extendedList = this.data.extendedList.map((item) => ({...item, open: false}))
    this.setData({
      list,
      // extendedList,

    })
  },
  kindExtenedListToggle(e) {
    const id = e.currentTarget.id
    const extendedList = this.data.extendedList
    for (let i = 0, len = extendedList.length; i < len; ++i) {
      if (extendedList[i].id === id) {
        extendedList[i].open = !extendedList[i].open
      } else {
        extendedList[i].open = false
      }
    }
    const list = this.data.list.map((item) => ({...item, open: false}))
    this.setData({
      extendedList,
      list,
    })
  },
  themeToggle() {
    const App = getApp()

    if (App.themeChanged) {
      if (App.globalData.theme === 'light') {
        App.themeChanged('dark')
      } else {
        App.themeChanged('light')
      }
    }
  },
  // 随机打乱数组
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // 显示球号
  showBalls(e) {
    const index = e.currentTarget.dataset.index;
    const showKey = `player${index}Show`;
    this.setData({
      [showKey]: true
    });
  },

  // 隐藏球号
  hideBalls(e) {
    const index = e.currentTarget.dataset.index;
    const showKey = `player${index}Show`;
    this.setData({
      [showKey]: false
    });
  },

  // 分配球
  distributeBalls() {
    // 创建1-15的数组
    let balls = Array.from({length: 15}, (_, i) => i + 1);
    
    // 随机打乱数组
    balls = this.shuffleArray(balls);
    
    // 分成三组，每组5个，并重置显示状态
    this.setData({
      player1Balls: balls.slice(0, 5).sort((a, b) => a - b),
      player2Balls: balls.slice(5, 10).sort((a, b) => a - b),
      player3Balls: balls.slice(10, 15).sort((a, b) => a - b),
      player1Show: false,
      player2Show: false,
      player3Show: false
    });
  },

  // 编辑球友名字
  editPlayerName(e) {
    const index = e.currentTarget.dataset.index;
    const editingKey = `player${index}Editing`;
    this.setData({
      [editingKey]: true
    });
  },

  // 保存球友名字
  savePlayerName(e) {
    const index = e.currentTarget.dataset.index;
    const nameKey = `player${index}Name`;
    const editingKey = `player${index}Editing`;
    const newName = e.detail.value.trim();
    
    this.setData({
      [nameKey]: newName || `球友${index}`,
      [editingKey]: false
    });
  },

  // 重置
  resetBalls() {
    this.setData({
      player1Balls: [],
      player2Balls: [],
      player3Balls: [],
      player1Show: false,
      player2Show: false,
      player3Show: false
    });
  }
})
