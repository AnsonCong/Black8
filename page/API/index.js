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

  // ... 其他代码 ...
}); 