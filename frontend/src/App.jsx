import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [updateUserName, setUpdateUserName] = useState('');
  const [updateUserId, setUpdateUserId] = useState(null);
  const port = process.env.REACT_APP_PORT || 4002

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = () => {
    axios.get(`http://localhost:${port}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  // Handle adding a new user
  const handleAddUser = () => {
    axios.post(`http://localhost:${port}/users`, { name: newUserName })
      .then(() => {
        setNewUserName('');
        fetchUsers();  // Fetch updated users list
      })
      .catch(error => console.error('Error adding user:', error));
  };

  // Handle updating a user
  const handleUpdateUser = () => {
    axios.put(`http://localhost:${port}/users/${updateUserId}`, { name: updateUserName })
      .then(() => {
        setUpdateUserName('');
        setUpdateUserId(null);
        fetchUsers();  // Fetch updated users list
      })
      .catch(error => console.error('Error updating user:', error));
  };

  // Handle deleting a user
  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:${port}/users/${id}`)
      .then(() => {
        fetchUsers();  // Fetch updated users list
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h1>CRUD App</h1>

      {/* Display all users */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => { setUpdateUserId(user.id); setUpdateUserName(user.name); }}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Add new user */}
      <input
        type="text"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        placeholder="New user name"
      />
      <button onClick={handleAddUser}>Add User</button>

      {/* Edit user */}
      {updateUserId && (
        <>
          <input
            type="text"
            value={updateUserName}
            onChange={(e) => setUpdateUserName(e.target.value)}
            placeholder="Update user name"
          />
          <button onClick={handleUpdateUser}>Update User</button>
        </>
      )}
    </div>
  );
}

export default App;
