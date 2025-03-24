import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

const Container = styled.div`
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  color: white;
`;

const Title = styled.h2`
  color: #ffc62d;
  margin-bottom: 2rem;
`;

const PromotionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #ffc62d;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #ffc62d;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ffc62d;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #e6b229;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    color: #ffc62d;
  }
`;

const DeleteButton = styled(Button)`
  background: #ff4444;
  color: white;
  
  &:hover {
    background: #cc3333;
  }
`;

const PromotionsManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'payment_method',
    percentage: '',
    code: '',
    enabled: true,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'promotions'));
      const promotionsData = [];
      querySnapshot.forEach((doc) => {
        promotionsData.push({ id: doc.id, ...doc.data() });
      });
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promotionRef = doc(collection(db, 'promotions'));
      await setDoc(promotionRef, {
        ...newPromotion,
        percentage: Number(newPromotion.percentage),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setNewPromotion({
        name: '',
        type: 'payment_method',
        percentage: '',
        code: '',
        enabled: true,
        startDate: '',
        endDate: ''
      });
      
      loadPromotions();
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'promotions', id));
      loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  return (
    <Container>
      <Title>Promotions Manager</Title>
      
      <PromotionForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Promotion Name"
          value={newPromotion.name}
          onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
          required
        />
        
        <Select
          value={newPromotion.type}
          onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
          required
        >
          <option value="payment_method">Payment Method</option>
          <option value="referral">Referral</option>
          <option value="seasonal">Seasonal</option>
          <option value="special">Special</option>
        </Select>
        
        <Input
          type="number"
          placeholder="Discount Percentage"
          value={newPromotion.percentage}
          onChange={(e) => setNewPromotion({ ...newPromotion, percentage: e.target.value })}
          required
          min="0"
          max="100"
        />
        
        <Input
          type="text"
          placeholder="Promotion Code"
          value={newPromotion.code}
          onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
          required
        />
        
        <Input
          type="datetime-local"
          placeholder="Start Date"
          value={newPromotion.startDate}
          onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
        />
        
        <Input
          type="datetime-local"
          placeholder="End Date"
          value={newPromotion.endDate}
          onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
        />
        
        <Button type="submit">Add Promotion</Button>
      </PromotionForm>
      
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Percentage</th>
            <th>Code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td>{promotion.name}</td>
              <td>{promotion.type}</td>
              <td>{promotion.percentage}%</td>
              <td>{promotion.code}</td>
              <td>{promotion.enabled ? 'Active' : 'Inactive'}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(promotion.id)}>
                  Delete
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PromotionsManager; 