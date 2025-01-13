import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const DashboardContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #ffc62d;
  margin-bottom: 2rem;
`;

const OrdersTable = styled.div`
  background: #222;
  border-radius: 8px;
  overflow-x: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.delete ? '#ff4444' : '#333'};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.delete ? '#ff6666' : '#444'};
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.8fr 0.8fr;
  padding: 1rem;
  background: #2a2a2a;
  font-weight: bold;
  border-bottom: 1px solid #333;
  min-width: 1400px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.8fr 0.8fr;
  padding: 1rem;
  border-bottom: 1px solid #333;
  align-items: center;
  min-width: 1400px;

  &:hover {
    background: #2a2a2a;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${props => {
    switch (props.status) {
      case 'completed': return 'rgba(0, 255, 0, 0.2)';
      case 'pending': return 'rgba(255, 198, 45, 0.2)';
      case 'failed': return 'rgba(255, 0, 0, 0.2)';
      default: return '#333';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#4caf50';
      case 'pending': return '#ffc62d';
      case 'failed': return '#ff4444';
      default: return 'white';
    }
  }};

  &:hover {
    opacity: 0.8;
  }
`;

const Amount = styled.span`
  color: #ffc62d;
  font-weight: bold;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-size: 1.1rem;
  }
`;

const FastPassBadge = styled.span`
  background: rgba(255, 198, 45, 0.2);
  color: #ffc62d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (orderId, docId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      try {
        await deleteDoc(doc(db, 'orders', docId));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order. Please try again.');
      }
    }
  };

  const toggleStatus = async (docId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await updateDoc(doc(db, 'orders', docId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <DashboardContainer>
      <Header>ACI Admin Dashboard</Header>
      
      <OrdersTable>
        <TableHeader>
          <div>Order ID</div>
          <div>Customer</div>
          <div>Contact</div>
          <div>Amount</div>
          <div>Account Size</div>
          <div>Platform</div>
          <div>Payment</div>
          <div>Fast Pass</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </TableHeader>

        {orders.map(order => (
          <TableRow key={order.id}>
            <div>{order.orderId}</div>
            <div>{`${order.customerInfo.firstName} ${order.customerInfo.lastName}`}</div>
            <div>
              <div>{order.customerInfo.email}</div>
              <div style={{ color: '#999', fontSize: '0.9rem' }}>{order.customerInfo.phone}</div>
            </div>
            <Amount>${order.orderDetails.finalAmount.toLocaleString()}</Amount>
            <div>${order.orderDetails.accountSize.toLocaleString()}</div>
            <div>
              {order.orderDetails.platform === 'mt4' ? 'MT4' : 'MT5'}
            </div>
            <PaymentMethod>
              {order.orderDetails.paymentMethod === 'crypto' ? (
                <>
                  <span>₿</span> Crypto
                </>
              ) : (
                <>
                  <span>💳</span> Card
                </>
              )}
            </PaymentMethod>
            <div>
              {order.orderDetails.fastPass ? (
                <FastPassBadge>Yes</FastPassBadge>
              ) : (
                'No'
              )}
            </div>
            <div>
              <StatusBadge 
                status={order.status}
                onClick={() => toggleStatus(order.id, order.status)}
                title="Click to toggle status"
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </StatusBadge>
            </div>
            <div>{formatDate(order.timestamp)}</div>
            <ActionButtons>
              <ActionButton 
                delete 
                onClick={() => handleDelete(order.orderId, order.id)}
                title="Delete order"
              >
                Delete
              </ActionButton>
            </ActionButtons>
          </TableRow>
        ))}
      </OrdersTable>
    </DashboardContainer>
  );
}

export default AdminDashboard; 