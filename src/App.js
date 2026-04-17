import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
function App() {
  return (
    <div className="appRoot">
      <div className="toasterHost">
        <Toaster
          position="top-right"
          toastOptions={
            {
              success: {
                theme: {
                  primary: '#4aed88',
                },
              },
            }
          }
        />
      </div>
      <BrowserRouter>
        <div className="appShell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:roomId" element={<EditorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
