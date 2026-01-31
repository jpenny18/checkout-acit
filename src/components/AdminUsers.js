import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Download, Edit, Trash2, Users, Copy, Mail } from 'lucide-react';

const Container = styled.div`
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 198, 45, 0.2);
  
  h3 {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .value {
    color: #ffc62d;
    font-size: 2rem;
    font-weight: 600;
  }
  
  .subtext {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.variant === 'primary' && `
    background: #ffc62d;
    color: #1a1a1a;
    
    &:hover {
      background: #e6b229;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #ff4444;
    color: white;
    
    &:hover {
      background: #ff6666;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Table = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: auto 2fr 1fr 1fr 1fr auto;
  padding: 1rem;
  background: rgba(26, 26, 26, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: auto 2fr 1fr 1fr auto;
    .hide-tablet {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 2fr 1fr auto;
    .hide-mobile {
      display: none;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: auto 2fr 1fr 1fr 1fr auto;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 1rem;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(26, 26, 26, 0.3);
  }

  @media (max-width: 1024px) {
    grid-template-columns: auto 2fr 1fr 1fr auto;
    .hide-tablet {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 2fr 1fr auto;
    .hide-mobile {
      display: none;
    }
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.delete ? '#ff4444' : '#ffc62d'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #999;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #4caf50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: calc(100% - 2rem);
  }
`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    activeThisMonth: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = [];
      let activeThisMonth = 0;
      let newThisMonth = 0;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        userData.push(data);

        // Calculate stats
        if (data.lastActive && data.lastActive.toDate() > thirtyDaysAgo) {
          activeThisMonth++;
        }
        if (data.createdAt && data.createdAt.toDate() > thirtyDaysAgo) {
          newThisMonth++;
        }
      });

      setUsers(userData);
      setStats({
        total: userData.length,
        activeThisMonth,
        newThisMonth
      });
    });

    return () => unsubscribe();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
      try {
        const deletePromises = Array.from(selectedUsers).map(userId => 
          deleteDoc(doc(db, 'users', userId))
        );
        await Promise.all(deletePromises);
        setSelectedUsers(new Set());
      } catch (error) {
        console.error('Error deleting users:', error);
        alert('Error deleting users. Please try again.');
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phone: editingUser.phone,
        role: editingUser.role
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleCopyEmails = async () => {
    try {
      const emails = users
        .map(user => user.email)
        .filter(email => email) // Filter out any undefined/null emails
        .join(', ');
      
      await navigator.clipboard.writeText(emails);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (error) {
      console.error('Error copying emails:', error);
      alert('Error copying emails. Please try again.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'First Name', 'Last Name', 'Phone', 'Created At'];
    const csvData = users.map(user => [
      user.email,
      user.firstName || '',
      user.lastName || '',
      user.phone || '',
      user.createdAt ? user.createdAt.toDate().toLocaleString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString();
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      {showCopySuccess && (
        <SuccessMessage>
          <Copy size={20} />
          <span>{users.length} email addresses copied to clipboard! Ready to paste into BCC field.</span>
        </SuccessMessage>
      )}
      
      <StatsGrid>
        <StatCard>
          <h3>Total Users</h3>
          <div className="value">{stats.total}</div>
          <div className="subtext">All time</div>
        </StatCard>
        <StatCard>
          <h3>Active Users</h3>
          <div className="value">{stats.activeThisMonth}</div>
          <div className="subtext">Last 30 days</div>
        </StatCard>
        <StatCard>
          <h3>New Users</h3>
          <div className="value">{stats.newThisMonth}</div>
          <div className="subtext">Last 30 days</div>
        </StatCard>
      </StatsGrid>

      <ActionsBar>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={handleCopyEmails}>
            <Copy size={18} />
            Copy All Emails for BCC
          </Button>
          <Button variant="primary" onClick={handleExportCSV}>
            <Download size={18} />
            Export CSV
          </Button>
          <Button
            variant="danger"
            onClick={handleBulkDelete}
            disabled={selectedUsers.size === 0}
          >
            <Trash2 size={18} />
            Delete Selected ({selectedUsers.size})
          </Button>
        </div>
      </ActionsBar>

      <Table>
        <TableHeader>
          <Checkbox
            checked={selectedUsers.size === filteredUsers.length}
            onChange={handleSelectAll}
          />
          <div>Email</div>
          <div className="hide-mobile">Name</div>
          <div className="hide-tablet">Phone</div>
          <div className="hide-mobile">Created</div>
          <div>Actions</div>
        </TableHeader>

        {filteredUsers.map(user => (
          <TableRow key={user.id}>
            <Checkbox
              checked={selectedUsers.has(user.id)}
              onChange={() => handleSelectUser(user.id)}
            />
            <div>{user.email}</div>
            <div className="hide-mobile">
              {user.firstName} {user.lastName}
            </div>
            <div className="hide-tablet">{user.phone || 'N/A'}</div>
            <div className="hide-mobile">
              {formatDate(user.createdAt)}
            </div>
            <ActionButtons>
              <ActionButton onClick={() => setEditingUser(user)}>
                <Edit size={18} />
              </ActionButton>
              <ActionButton delete onClick={() => handleDelete(user.id)}>
                <Trash2 size={18} />
              </ActionButton>
            </ActionButtons>
          </TableRow>
        ))}
      </Table>

      {editingUser && (
        <Modal onClick={() => setEditingUser(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: '#ffc62d' }}>Edit User</h2>
            <Form onSubmit={handleEdit}>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={editingUser.firstName || ''}
                  onChange={e => setEditingUser({
                    ...editingUser,
                    firstName: e.target.value
                  })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={editingUser.lastName || ''}
                  onChange={e => setEditingUser({
                    ...editingUser,
                    lastName: e.target.value
                  })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={e => setEditingUser({
                    ...editingUser,
                    phone: e.target.value
                  })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Role</Label>
                <Input
                  type="text"
                  value={editingUser.role || ''}
                  onChange={e => setEditingUser({
                    ...editingUser,
                    role: e.target.value
                  })}
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button type="button" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminUsers; 