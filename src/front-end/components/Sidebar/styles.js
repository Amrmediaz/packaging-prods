const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#0f172a', // Slate-900: لون أفخم من الـ Slate العادي
    borderRight: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // حركة أنعم (Smooth transition)
    zIndex: 9999,
  },
  
  
  // زر الموبايل (Hamburger Menu)
  mobileToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 1100,
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    width: '42px',
    height: '42px',
    fontSize: '22px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },

  // الطبقة الشفافة خلف المنيو في الموبايل
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
    backdropFilter: 'blur(4px)', // تأثير زجاجي (Frosted glass)
  },

  // Logo Section
  logo: {
    padding: '40px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '20px',
    backgroundColor: '#3b82f6',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: '#fff',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: '-0.5px',
  },

  // Navigation
  nav: {
    flex: 1,
    padding: '0 16px',
    overflowY: 'auto', // لو اللينكات كتير يقدر يسكول جوه المنيو
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569', // Slate-500
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    margin: '24px 0 10px 12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '12px',
    color: '#94a3b8', // Slate-400
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px',
    fontSize: '15px',
    fontWeight: '500',
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // خلفية زرقاء خفيفة جداً
    color: '#3b82f6', // النص واللون الأساسي أزرق
    fontWeight: '600',
  },
  navItemHover: {
    backgroundColor: '#1e293b', // Slate-800
    color: '#f8fafc',
  },
  navIcon: {
    marginRight: '12px',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
  },

  // Footer & Logout
  footer: {
    padding: '20px 16px',
    borderTop: '1px solid #1e293b',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)', // خلفية حمراء باهتة جداً
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
};

export default styles;