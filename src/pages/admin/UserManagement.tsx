import React, { useState, useEffect } from 'react';
import styles from './styles/UserManagement.module.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'parent' | 'child' | 'admin';
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // 模拟数据加载
  useEffect(() => {
    // 模拟异步数据获取
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: '1',
          username: '张小明',
          email: 'zhang@example.com',
          role: 'parent',
          createdAt: '2024-05-01',
          lastLogin: '2024-06-15T10:30:00',
          status: 'active'
        },
        {
          id: '2',
          username: '李华',
          email: 'lihua@example.com',
          role: 'child',
          createdAt: '2024-05-10',
          lastLogin: '2024-06-14T16:20:00',
          status: 'active'
        },
        {
          id: '3',
          username: '王丽',
          email: 'wangli@example.com',
          role: 'parent',
          createdAt: '2024-04-25',
          lastLogin: '2024-06-10T09:15:00',
          status: 'inactive'
        },
        {
          id: '4',
          username: '陈杰',
          email: 'chenjie@example.com',
          role: 'admin',
          createdAt: '2024-04-01',
          lastLogin: '2024-06-15T14:45:00',
          status: 'active'
        },
        {
          id: '5',
          username: '赵小红',
          email: 'zhao@example.com',
          role: 'child',
          createdAt: '2024-05-20',
          lastLogin: '2024-06-15T08:30:00',
          status: 'active'
        },
        {
          id: '6',
          username: '刘强',
          email: 'liuqiang@example.com',
          role: 'parent',
          createdAt: '2024-03-15',
          lastLogin: '2024-06-08T11:20:00',
          status: 'active'
        },
        {
          id: '7',
          username: '孙梅',
          email: 'sunmei@example.com',
          role: 'child',
          createdAt: '2024-04-10',
          lastLogin: '2024-06-05T15:40:00',
          status: 'inactive'
        },
        {
          id: '8',
          username: '周军',
          email: 'zhou@example.com',
          role: 'parent',
          createdAt: '2024-02-28',
          lastLogin: '2024-06-14T13:10:00',
          status: 'active'
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);

  // 筛选用户
  useEffect(() => {
    let result = [...users];
    
    // 搜索筛选
    if (searchTerm) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 角色筛选
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterRole, users]);

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 切换用户状态
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>用户管理</h1>
      
      <div className={styles.filterContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.roleFilter}>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className={styles.roleSelect}
          >
            <option value="all">全部角色</option>
            <option value="parent">家长</option>
            <option value="child">儿童</option>
            <option value="admin">管理员</option>
          </select>
        </div>
      </div>
      
      <div className={styles.userListContainer}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>创建时间</th>
                <th>最后登录</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={user.status === 'inactive' ? styles.inactiveRow : ''}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[`role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`]}`}>
                      {user.role === 'parent' ? '家长' : user.role === 'child' ? '儿童' : '管理员'}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                  <td>{formatDateTime(user.lastLogin)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`]}`}>
                      {user.status === 'active' ? '活跃' : '未活跃'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.actionButton}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'active' ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredUsers.length === 0 && (
          <div className={styles.emptyState}>没有找到匹配的用户</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;