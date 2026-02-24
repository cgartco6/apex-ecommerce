import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
