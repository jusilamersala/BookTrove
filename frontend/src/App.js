import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext'; 

// Components
import ProtectedRoute from './ProtectedRoute';
import BookTroveNavbar from './BookTroveNavbar';
import Footer from './Footer';
import Home from './Home';
import Books from './Books'; 
import Genres from './Genres';
import Event from './Event';
import About from './About';
import Blog from './Blog';
import Contact from './Contact';
import Cart from './Cart';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import AdminPanel from './AdminPanel';
import InventoryManager from './InventoryManager';

// CRUD
import CreateItem from './CRUD/CreateItem';
import ReadAll from './CRUD/ReadAll';
import ReadOne from './CRUD/ReadOne';
import UpdateItem from './CRUD/UpdateItem';

const AdminDashboardWrapper = () => {
  const user = JSON.parse(localStorage.getItem('user')); 
  
  if (user?.role === 'admin') {
    return <AdminPanel />;
  } else if (user?.role === 'inventory_manager') {
    return <InventoryManager />;
  } else {
    return <div className="text-center mt-5">Duke u ngarkuar ose pa autorizim...</div>;
  }
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <BookTroveNavbar />
            
            <main style={{ minHeight: '80vh' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/librat" element={<Books />} />
                <Route path="/zhanerat" element={<Genres />} />
                <Route path="/eventet" element={<Event />} />
                <Route path="/rreth-nesh" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/kontakt" element={<Contact />} />
                <Route path="/shporta" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />

                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole={["admin", "inventory_manager"]}>
                       <AdminDashboardWrapper />
                    </ProtectedRoute>
                  } 
                />
 
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute requiredRole={["admin", "inventory_manager"]}>
                      <CreateItem />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/list"
                  element={
                    <ProtectedRoute requiredRole={["admin", "inventory_manager"]}>
                      <ReadAll />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/read/:id"
                  element={
                    <ProtectedRoute requiredRole={["admin", "inventory_manager"]}>
                      <ReadOne />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/update/:id"
                  element={
                    <ProtectedRoute requiredRole={["admin", "inventory_manager"]}>
                      <UpdateItem />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;