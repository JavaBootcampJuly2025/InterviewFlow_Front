import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children, user, handleLogout }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <Header user={user} handleLogout={handleLogout} />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <main style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
