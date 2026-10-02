import { useAuth } from './context/AuthContext';

import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h3>Cargando sesión...</h3>
      </div>
    );
  }

  if (!user) {
    return <AuthView/>;
  }
  
  return <DashboardView/>;
}

export default App;


