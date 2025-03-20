Page({
  data: {
    players: [
      { id: 1, name: '球友1', score: 0, type: 'normal', isEditing: false },
      { id: 2, name: '球友2', score: 0, type: 'normal', isEditing: false }
    ],
    isPlaying: false,
    isCustomAdd: false,
    isCustomSubtract: false,
    customAddValue: 10,
    customSubtractValue: 10,
    selectedPlayerId: null,
    tempCustomAddValue: '',
    tempCustomSubtractValue: ''
  },

  onCustomAddInput: function(e) {
    console.log('输入加分值:', e.detail.value);
    this.setData({
      tempCustomAddValue: e.detail.value
    });
  },

  onCustomSubtractInput: function(e) {
    console.log('输入减分值:', e.detail.value);
    this.setData({
      tempCustomSubtractValue: e.detail.value
    });
  },

  onLoad() {
    console.log('页面加载');
    // 确保页面加载时有初始数据
    if (!this.data.players || this.data.players.length === 0) {
      this.setData({
        players: [
          { id: 1, name: '球友1', score: 0, type: 'normal', isEditing: false },
          { id: 2, name: '球友2', score: 0, type: 'normal', isEditing: false }
        ]
      });
    }
  },

  onShareAppMessage() {
    return {
      title: 'Black Eight',
      path: 'page/API/index'
    }
  },

  addPlayer() {
    console.log('添加球友按钮被点击');
    if (this.data.isPlaying) {
      wx.showToast({
        title: '比赛中无法添加球友',
        icon: 'none'
      });
      return;
    }

    const { players } = this.data;
    if (players.length >= 4) {
      wx.showToast({
        title: '最多只能添加4个球友',
        icon: 'none'
      });
      return;
    }

    const newPlayer = {
      id: players.length + 1,
      name: `球友${players.length + 1}`,
      score: 0,
      type: 'normal',
      isEditing: false
    };

    this.setData({
      players: [...players, newPlayer]
    }, () => {
      console.log('球友添加成功，当前球友数量：', this.data.players.length);
    });
  },

  removePlayer() {
    console.log('减少球友按钮被点击');
    if (this.data.isPlaying) {
      wx.showToast({
        title: '比赛中无法减少球友',
        icon: 'none'
      });
      return;
    }

    const { players } = this.data;
    if (players.length <= 2) {
      wx.showToast({
        title: '至少需要保留2个球友',
        icon: 'none'
      });
      return;
    }

    // 移除最后一个球友
    const newPlayers = players.slice(0, -1);
    this.setData({
      players: newPlayers
    }, () => {
      console.log('球友减少成功，当前球友数量：', this.data.players.length);
    });
  },

  startMatch() {
    console.log('开始比赛按钮被点击');
    this.setData({
      isPlaying: true,
      selectedPlayerId: null
    }, () => {
      console.log('比赛状态已更新：', this.data.isPlaying);
    });
    wx.showToast({
      title: '比赛开始',
      icon: 'success'
    });
  },

  endMatch() {
    console.log('结束比赛按钮被点击');
    this.setData({
      isPlaying: false,
      selectedPlayerId: null
    }, () => {
      console.log('比赛状态已更新：', this.data.isPlaying);
    });
    wx.showToast({
      title: '比赛结束',
      icon: 'success'
    });
  },

  // 重置所有球友分数
  resetScores() {
    if (this.data.isPlaying) {
      wx.showToast({
        title: '比赛进行中无法重置',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有球友的分数吗？',
      success: (res) => {
        if (res.confirm) {
          const players = this.data.players.map(player => ({
            ...player,
            score: 0
          }));
          
          this.setData({ players }, () => {
            wx.showToast({
              title: '分数已重置',
              icon: 'success'
            });
          });
        }
      }
    });
  },

  editPlayerName(e) {
    if (this.data.isPlaying) return;
    
    const index = e.currentTarget.dataset.index;
    const players = this.data.players.map((player, i) => ({
      ...player,
      isEditing: i === index
    }));
    
    this.setData({ players });
  },

  savePlayerName(e) {
    const index = e.currentTarget.dataset.index;
    const newName = e.detail.value.trim();
    const players = this.data.players.map((player, i) => {
      if (i === index) {
        return {
          ...player,
          name: newName || `球友${index + 1}`,
          isEditing: false
        };
      }
      return player;
    });
    
    this.setData({ players });
  },

  showCustomAdd() {
    wx.vibrateShort();
    this.setData({
      isCustomAdd: true,
      tempCustomAddValue: String(this.data.customAddValue)
    });
  },

  showCustomSubtract() {
    wx.vibrateShort();
    this.setData({
      isCustomSubtract: true,
      tempCustomSubtractValue: String(this.data.customSubtractValue)
    });
  },

  saveCustomAdd() {
    console.log('保存加分值');
    const value = parseInt(this.data.tempCustomAddValue);
    
    if (!isNaN(value) && value > 0) {
      console.log('有效的加分值:', value);
      
      // 先更新自定义值并关闭编辑状态
      this.setData({
        customAddValue: value,
        isCustomAdd: false,
        tempCustomAddValue: ''
      }, () => {
        console.log('自定义加分值已更新');
        
        // 如果有选中的球友，立即应用分数
        if (this.data.selectedPlayerId) {
          console.log('应用加分到选中球友');
          const players = this.data.players.map(player => {
            if (player.id === this.data.selectedPlayerId) {
              console.log('更新球友分数:', player.score, '+', value);
              return {
                ...player,
                score: player.score + value
              };
            }
            return player;
          });
          
          this.setData({ players }, () => {
            console.log('分数更新完成');
          });
        }
      });
    } else {
      console.log('无效的加分值');
      wx.showToast({
        title: '请输入有效数字',
        icon: 'none'
      });
    }
  },

  saveCustomSubtract() {
    console.log('保存减分值');
    const value = parseInt(this.data.tempCustomSubtractValue);
    
    if (!isNaN(value) && value > 0) {
      console.log('有效的减分值:', value);
      
      // 先更新自定义值并关闭编辑状态
      this.setData({
        customSubtractValue: value,
        isCustomSubtract: false,
        tempCustomSubtractValue: ''
      }, () => {
        console.log('自定义减分值已更新');
        
        // 如果有选中的球友，立即应用分数
        if (this.data.selectedPlayerId) {
          console.log('应用减分到选中球友');
          const players = this.data.players.map(player => {
            if (player.id === this.data.selectedPlayerId) {
              console.log('更新球友分数:', player.score, '-', value);
              return {
                ...player,
                score: player.score - value
              };
            }
            return player;
          });
          
          this.setData({ players }, () => {
            console.log('分数更新完成');
          });
        }
      });
    } else {
      console.log('无效的减分值');
      wx.showToast({
        title: '请输入有效数字',
        icon: 'none'
      });
    }
  },

  cancelCustomAdd() {
    console.log('取消加分编辑');
    this.setData({
      isCustomAdd: false,
      tempCustomAddValue: ''
    });
  },

  cancelCustomSubtract() {
    console.log('取消减分编辑');
    this.setData({
      isCustomSubtract: false,
      tempCustomSubtractValue: ''
    });
  },

  // 选择球友
  selectPlayer(e) {
    if (!this.data.isPlaying) return;
    
    const playerId = e.currentTarget.dataset.id;
    // 如果点击已选中的球友，则取消选中
    const newSelectedId = this.data.selectedPlayerId === playerId ? null : playerId;
    
    this.setData({
      selectedPlayerId: newSelectedId
    }, () => {
      if (newSelectedId) {
        wx.vibrateShort(); // 添加触感反馈
      }
    });
  },

  // 点击自定义加分按钮
  addCustomScore(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    if (!this.data.selectedPlayerId) {
      wx.showToast({
        title: '请先选择球友',
        icon: 'none'
      });
      return;
    }

    const players = this.data.players.map(player => {
      if (player.id === this.data.selectedPlayerId) {
        return {
          ...player,
          score: player.score + value
        };
      }
      return player;
    });

    this.setData({ players });
  },

  // 点击自定义减分按钮
  subtractCustomScore(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    if (!this.data.selectedPlayerId) {
      wx.showToast({
        title: '请先选择球友',
        icon: 'none'
      });
      return;
    }

    const players = this.data.players.map(player => {
      if (player.id === this.data.selectedPlayerId) {
        return {
          ...player,
          score: player.score - value
        };
      }
      return player;
    });

    this.setData({ players });
  }
});