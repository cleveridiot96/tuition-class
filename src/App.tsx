
import { useEffect } from 'react';
import { initializeSampleData } from './services/dataInitializer';
import RouterComponent from './router';
import './App.css';

function App() {
  // Initialize sample data when the app starts
  useEffect(() => {
    initializeSampleData();
  }, []);

  return <RouterComponent />;
}

export default App;
