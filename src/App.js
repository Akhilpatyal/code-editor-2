import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
function App() {
  return (
    <>
      <div>
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
        ></Toaster>
      </div>
      {/* browser routes for routing overall website */}
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />}></Route>

          <Route path="/EditorPage/:roomId" element={<EditorPage />}>

          </Route>

        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
