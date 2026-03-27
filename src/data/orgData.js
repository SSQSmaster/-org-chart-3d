export const orgData = {
  nodes: [
    { id: 'ceo', name: '张总', title: '首席执行官', department: 'executive', avatar: '👔' },
    { id: 'cto', name: '李技术', title: '技术总监', department: 'technology', avatar: '💻' },
    { id: 'cfo', name: '王财务', title: '财务总监', department: 'finance', avatar: '💰' },
    { id: 'coo', name: '刘运营', title: '运营总监', department: 'operations', avatar: '⚙️' },
    { id: 'dev1', name: '前端工程师', title: '高级前端开发', department: 'technology', avatar: '🎨' },
    { id: 'dev2', name: '后端工程师', title: '高级后端开发', department: 'technology', avatar: '🛠️' },
    { id: 'fin1', name: '会计', title: '会计专员', department: 'finance', avatar: '📊' },
    { id: 'hr', name: '陈人事', title: '人力资源经理', department: 'hr', avatar: '👥' },
  ],
  links: [
    { source: 'ceo', target: 'cto' },
    { source: 'ceo', target: 'cfo' },
    { source: 'ceo', target: 'coo' },
    { source: 'ceo', target: 'hr' },
    { source: 'cto', target: 'dev1' },
    { source: 'cto', target: 'dev2' },
    { source: 'cfo', target: 'fin1' },
  ]
};

export const departmentColors = {
  executive: '#e74c3c',
  technology: '#3498db',
  finance: '#27ae60',
  operations: '#f39c12',
  hr: '#9b59b6',
};

export const getDepartmentColor = (department) => {
  return departmentColors[department] || '#95a5a6';
};