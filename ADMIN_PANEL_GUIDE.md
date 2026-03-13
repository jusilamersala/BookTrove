# Admin Panel Setup Guide

## Overview
This admin panel system provides a secure way for administrators to manage items (books) in the BookTrove application. Only users with the "admin" role can access these features.

## Architecture

### Backend Components

#### 1. **Auth Middleware** (`backend/middleware/authMiddleware.js`)
- `authenticate`: Verifies JWT token and checks if user is logged in
- `adminOnly`: Extends authentication to verify user has admin role

#### 2. **Protected Routes** (`backend/Routes/ItemRoute.js`)
- CREATE: `POST /api/items` - Admin only
- READ: `GET /api/items` - Public
- READ ONE: `GET /api/items/:id` - Public
- UPDATE: `PUT /api/items/:id` - Admin only
- DELETE: `DELETE /api/items/:id` - Admin only

### Frontend Components

#### 1. **AuthContext** (`frontend/src/AuthContext.jsx`)
Enhanced with:
- `isAdmin()`: Returns true if user has admin role
- `isAuthenticated()`: Returns true if user is logged in

#### 2. **ProtectedRoute** (`frontend/src/ProtectedRoute.jsx`)
- Wrapper component that checks user role
- Redirects to login if not authenticated
- Shows "Access Denied" message if not admin

#### 3. **AdminPanel** (`frontend/src/AdminPanel.jsx`)
Main admin interface with tabs:
- **Manage Items Tab**: View all books in a table, Edit/Delete books
- **Create Items Tab**: Add new books with form validation

Features:
- Loading states with spinners
- Error and success notifications
- Modal for editing items
- Responsive design
- Input validation

#### 4. **Updated Routes** (`frontend/src/App.js`)
- Added `/admin` route protected with `ProtectedRoute`

#### 5. **Updated Navbar** (`frontend/src/BookTroveNavbar.jsx`)
- Shows "Admin" link only for admin users
- Admin panel access from dropdown menu

## How to Use

### For Developers

1. **Set up middleware** (already done):
   ```javascript
   const { adminOnly, authenticate } = require("../middleware/authMiddleware");
   ```

2. **Protect routes** (already done):
   ```javascript
   router.post("/", adminOnly, async (req, res) => {
     // Admin-only code
   });
   ```

3. **Use ProtectedRoute** in React (already done):
   ```javascript
   <Route 
     path="/admin" 
     element={
       <ProtectedRoute requiredRole="admin">
         <AdminPanel />
       </ProtectedRoute>
     } 
   />
   ```

### For Admins (End Users)

1. **Login** with an admin account
   - Role must be set to "admin" in database

2. **Access Admin Panel**
   - Click "Admin" link in navbar
   - Or go to `/admin` directly

3. **Manage Books**
   - **View All**: See complete list in table format
   - **Create**: Fill form and click "Ruaj Librin"
   - **Edit**: Click pencil icon, modify, save
   - **Delete**: Click trash icon, confirm deletion

## Database User Roles

When creating a user in MongoDB, use one of these roles:
- `"user"` (default) - Regular customer
- `"admin"` - Full CRUD access to items
- `"employee"` - Future role for employees

Example:
```javascript
{
  username: "admin",
  email: "admin@booktrove.com",
  password: "hashedPassword",
  role: "admin"  // Important!
}
```

## Security Features

1. **JWT Authentication**: Tokens stored in secure HTTP-only cookies
2. **Role-based Access Control**: adminOnly middleware checks role
3. **Frontend Protection**: ProtectedRoute prevents unauthorized access
4. **Validation**: Backend validates all required fields

## API Endpoints

### Items Routes
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | /api/items | ✓ Admin | Create new item |
| GET | /api/items | - | Get all items |
| GET | /api/items/:id | - | Get single item |
| PUT | /api/items/:id | ✓ Admin | Update item |
| DELETE | /api/items/:id | ✓ Admin | Delete item |

## Styling

The AdminPanel uses:
- Bootstrap components (Table, Form, Modal, Alert, Spinner)
- Custom CSS with responsive design
- Red theme (#dc3545) matching BookTrove branding
- Icons from Bootstrap Icons

## Testing

To test the admin features:

1. **Create an admin user** in MongoDB:
   ```javascript
   db.users.insertOne({
     username: "testadmin",
     email: "testadmin@test.com",
     password: "hashed_password",
     role: "admin"
   })
   ```

2. **Login** as admin user

3. **Navigate** to `/admin` or click Admin link in navbar

4. **Test CRUD operations**:
   - Create a new book
   - View all books
   - Edit a book
   - Delete a book

## Troubleshooting

### "Access Denied" Message
- Check user role in database (must be "admin")
- Verify token is not expired

### Admin Link Not Showing
- Ensure user is logged in
- Check role is "admin" in JWT token
- Clear browser cache/localStorage

### CRUD Operations Fail
- Check browser console for error messages
- Verify backend server is running on port 5000
- Check backend logs for middleware errors
- Ensure JWT token is valid

## Future Enhancements

- Role management interface
- Item categories management
- User management
- Order management
- Analytics dashboard
- Export to CSV/PDF
- Bulk operations
- Advanced filtering and search
