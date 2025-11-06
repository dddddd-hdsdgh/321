// pages/parent/ChildManagement.js
Page({
  data: {
    children: [],
    currentChildIndex: 0,
    showAddChildModal: false,
    showEditChildModal: false,
    showDeleteConfirmModal: false,
    editingChildIndex: -1,
    childForm: {
      name: '',
      age: '',
      grade: '',
      avatar: '👶'
    },
    avatarOptions: ['👶', '👦', '👧', '🧒', '🐱', '🐶', '🐼', '🐨'],
    gradeOptions: ['幼儿园小班', '幼儿园中班', '幼儿园大班', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
  },

  onLoad(options) {
    this.loadChildrenInfo();
    // 如果URL中有mode=add参数，则自动打开添加儿童弹窗
    if (options && options.mode === 'add') {
      this.openAddChildModal();
    }
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.loadChildrenInfo();
  },

  /**
   * 加载儿童信息列表
   */
  loadChildrenInfo: function() {
    // 从缓存中获取儿童信息
    let children = wx.getStorageSync('children') || [];
    const currentChildIndex = wx.getStorageSync('currentChildIndex') || 0;
    
    // 如果没有儿童数据，使用默认数据
    if (children.length === 0) {
      children = [
        {
          id: '1',
          name: '小明',
          age: '7',
          grade: '一年级',
          avatar: '👦'
        },
        {
          id: '2',
          name: '小红',
          age: '7',
          grade: '一年级',
          avatar: '👧'
        }
      ];
      // 保存到缓存
      wx.setStorageSync('children', children);
    }
    
    this.setData({
      children,
      currentChildIndex
    });
  },

  /**
   * 打开添加儿童弹窗
   */
  openAddChildModal: function() {
    // 重置表单
    this.setData({
      childForm: {
        name: '',
        age: '',
        grade: '一年级',
        avatar: '👶'
      },
      showAddChildModal: true
    });
  },

  /**
   * 关闭弹窗
   */
  closeModal: function() {
    this.setData({
      showAddChildModal: false,
      showEditChildModal: false,
      showDeleteConfirmModal: false,
      editingChildIndex: -1
    });
  },

  /**
   * 表单输入处理
   */
  onInputChange: function(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`childForm.${field}`]: value
    });
  },

  /**
   * 选择头像
   */
  selectAvatar: function(e) {
    const { avatar } = e.currentTarget.dataset;
    this.setData({
      'childForm.avatar': avatar
    });
  },

  /**
   * 添加新儿童
   */
  addChild: function() {
    const { name, age, grade, avatar } = this.data.childForm;
    
    // 验证表单
    if (!name || name.trim() === '') {
      wx.showToast({
        title: '请输入孩子姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!age || isNaN(age) || age < 3 || age > 15) {
      wx.showToast({
        title: '请输入有效年龄(3-15岁)',
        icon: 'none'
      });
      return;
    }
    
    if (!grade) {
      wx.showToast({
        title: '请选择年级',
        icon: 'none'
      });
      return;
    }
    
    // 检查姓名是否已存在
    const isNameExists = this.data.children.some(child => child.name === name.trim());
    if (isNameExists) {
      wx.showToast({
        title: '该姓名已存在',
        icon: 'none'
      });
      return;
    }
    
    // 创建新儿童对象
    const newChild = {
      id: Date.now().toString(), // 使用时间戳作为唯一ID
      name,
      age,
      grade,
      avatar,
      stats: {
        totalStudyTime: 0,
        completedLessons: 0,
        achievements: 0,
        lastStudyTime: null
      },
      weekData: Array(7).fill(0), // 初始化一周的学习数据
      timeDistribution: {},
      achievements: [],
      suggestions: []
    };
    
    // 添加到儿童列表
    const children = [...this.data.children, newChild];
    
    // 保存到缓存
    wx.setStorageSync('children', children);
    
    // 更新数据
    this.setData({
      children,
      showAddChildModal: false
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  /**
   * 打开编辑儿童弹窗
   */
  openEditChildModal: function(e) {
    const { index } = e.currentTarget.dataset;
    const child = this.data.children[index];
    
    this.setData({
      childForm: {
        name: child.name,
        age: child.age,
        grade: child.grade,
        avatar: child.avatar
      },
      editingChildIndex: index,
      showEditChildModal: true
    });
  },

  /**
   * 编辑儿童信息
   */
  editChild: function() {
    const { name, age, grade, avatar } = this.data.childForm;
    const { editingChildIndex, children } = this.data;
    
    // 验证表单
    if (!name || name.trim() === '') {
      wx.showToast({
        title: '请输入孩子姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!age || isNaN(age) || age < 3 || age > 15) {
      wx.showToast({
        title: '请输入有效年龄(3-15岁)',
        icon: 'none'
      });
      return;
    }
    
    if (!grade) {
      wx.showToast({
        title: '请选择年级',
        icon: 'none'
      });
      return;
    }
    
    // 检查姓名是否与其他儿童重复
    const isNameExists = children.some((child, index) => 
      index !== editingChildIndex && child.name === name.trim()
    );
    if (isNameExists) {
      wx.showToast({
        title: '该姓名已存在',
        icon: 'none'
      });
      return;
    }
    
    // 更新儿童信息
    const updatedChildren = [...children];
    updatedChildren[editingChildIndex] = {
      ...updatedChildren[editingChildIndex],
      name,
      age,
      grade,
      avatar
    };
    
    // 保存到缓存
    wx.setStorageSync('children', updatedChildren);
    
    // 更新当前选中的儿童信息（如果是当前编辑的儿童）
    if (editingChildIndex === this.data.currentChildIndex) {
      wx.setStorageSync('childInfo', updatedChildren[editingChildIndex]);
    }
    
    // 更新数据
    this.setData({
      children: updatedChildren,
      showEditChildModal: false,
      editingChildIndex: -1
    });
    
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },

  /**
   * 打开删除确认弹窗
   */
  openDeleteConfirmModal: function(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      editingChildIndex: index,
      showDeleteConfirmModal: true
    });
  },

  /**
   * 删除儿童
   */
  deleteChild: function() {
    const { editingChildIndex, children, currentChildIndex } = this.data;
    
    // 不允许删除最后一个儿童
    if (children.length <= 1) {
      wx.showToast({
        title: '至少保留一个孩子',
        icon: 'none'
      });
      this.closeModal();
      return;
    }
    
    // 删除儿童
    const updatedChildren = children.filter((_, index) => index !== editingChildIndex);
    
    // 调整当前选中的儿童索引
    let newCurrentChildIndex = currentChildIndex;
    if (editingChildIndex === currentChildIndex) {
      // 如果删除的是当前选中的儿童，切换到第一个儿童
      newCurrentChildIndex = 0;
      wx.setStorageSync('currentChildIndex', 0);
      wx.setStorageSync('childInfo', updatedChildren[0]);
    } else if (editingChildIndex < currentChildIndex) {
      // 如果删除的儿童在当前选中儿童之前，索引减1
      newCurrentChildIndex = currentChildIndex - 1;
      wx.setStorageSync('currentChildIndex', newCurrentChildIndex);
    }
    
    // 保存到缓存
    wx.setStorageSync('children', updatedChildren);
    
    // 更新数据
    this.setData({
      children: updatedChildren,
      currentChildIndex: newCurrentChildIndex,
      showDeleteConfirmModal: false,
      editingChildIndex: -1
    });
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  /**
   * 设置为当前儿童
   */
  setAsCurrentChild: function(e) {
    const { index } = e.currentTarget.dataset;
    
    // 更新当前选中的儿童
    this.setData({
      currentChildIndex: index
    });
    
    // 保存到缓存
    wx.setStorageSync('currentChildIndex', index);
    wx.setStorageSync('childInfo', this.data.children[index]);
    
    wx.showToast({
      title: '已设置为当前孩子',
      icon: 'success'
    });
  },

  /**
   * 返回上一页
   */
  navigateBack: function() {
    wx.navigateBack();
  }
});