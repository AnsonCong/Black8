Page({
  data: {
    player1: {
      name: '选手1',
      score: 0,
      avatar: '🐱'
    },
    player2: {
      name: '选手2',
      score: 0,
      avatar: '🐶'
    },
    currentPlayer: 1,
    redBalls: 15,
    maxRedBalls: 15,
    gameStarted: false,
    // 彩球分值
    colors: [
      { name: '黄', value: 2, color: '#FFD700' },
      { name: '绿', value: 3, color: '#228B22' },
      { name: '棕', value: 4, color: '#8B4513' },
      { name: '蓝', value: 5, color: '#4169E1' },
      { name: '粉', value: 6, color: '#FF69B4' },
      { name: '黑', value: 7, color: '#000000' }
    ],
    // 犯规罚分选项
    fouls: [4, 5, 6, 7],
    editingPlayer: null
  },

  onLoad() {
    this.resetGame();
  },

  // 增加红球
  addRedBall() {
    if (this.data.redBalls < this.data.maxRedBalls) {
      this.setData({
        redBalls: this.data.redBalls + 1
      });
    }
  },

  // 减少红球
  minusRedBall() {
    if (this.data.redBalls > 0) {
      this.setData({
        redBalls: this.data.redBalls - 1
      });
    }
  },

  // 阻止事件冒泡（用于输入框区域）
  preventSelect() {
    // 什么都不做，只是阻止事件冒泡
  },

  // 选择开球方
  selectFirstPlayer(e) {
    if (this.data.gameStarted) return;
    const player = parseInt(e.currentTarget.dataset.player);
    this.setData({
      currentPlayer: player,
      gameStarted: true
    });
  },

  // 打进红球（1分）
  potRed() {
    if (this.data.redBalls > 0) {
      this.addScore(this.data.currentPlayer, 1);
      this.setData({
        redBalls: this.data.redBalls - 1
      });
    }
  },

  // 打进彩球
  potColor(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    this.addScore(this.data.currentPlayer, value);
  },

  // 增加分数
  addScore(player, points) {
    const key = player === 1 ? 'player1.score' : 'player2.score';
    const currentScore = player === 1 ? this.data.player1.score : this.data.player2.score;
    this.setData({
      [key]: currentScore + points
    });
  },

  // 犯规扣分
  foul(e) {
    const points = parseInt(e.currentTarget.dataset.points);
    // 给对方加分
    const opponent = this.data.currentPlayer === 1 ? 2 : 1;
    this.addScore(opponent, points);
  },

  // 切换当前选手
  switchPlayer() {
    const nextPlayer = this.data.currentPlayer === 1 ? 2 : 1;
    this.setData({
      currentPlayer: nextPlayer
    });
  },

  // 保存选手名字
  savePlayerName(e) {
    const player = parseInt(e.currentTarget.dataset.player);
    const newName = e.detail.value.trim();
    const key = player === 1 ? 'player1.name' : 'player2.name';
    this.setData({
      [key]: newName || (player === 1 ? '选手1' : '选手2')
    });
  },

  // 确认重置比赛
  confirmReset() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置比赛吗？当前比分将清零。',
      confirmColor: '#faad14',
      success: (res) => {
        if (res.confirm) {
          this.resetGame();
        }
      }
    });
  },

  // 重置比赛
  resetGame() {
    this.setData({
      'player1.score': 0,
      'player2.score': 0,
      redBalls: 15,
      currentPlayer: 1,
      gameStarted: false,
      editingPlayer: null
    });
  },

  // 撤销上一步（简化版，直接减分）
  undoScore(e) {
    const player = e.currentTarget.dataset.player;
    const key = player === 1 ? 'player1.score' : 'player2.score';
    const currentScore = player === 1 ? this.data.player1.score : this.data.player2.score;
    if (currentScore > 0) {
      this.setData({
        [key]: currentScore - 1
      });
    }
  }
});
