import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Section = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  color: #ffc62d;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #999;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  background: #ffc62d;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #e6b229;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SubscriptionCard = styled.div`
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubscriptionInfo = styled.div`
  color: #fff;
`;

const SubscriptionAmount = styled.div`
  font-size: 1.25rem;
  color: #ffc62d;
  font-weight: bold;
`;

const SubscriptionStatus = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${props => 
    props.status === 'active' ? 'rgba(76, 175, 80, 0.2)' :
    props.status === 'canceled' ? 'rgba(244, 67, 54, 0.2)' :
    'rgba(255, 198, 45, 0.2)'};
  color: ${props => 
    props.status === 'active' ? '#4caf50' :
    props.status === 'canceled' ? '#f44336' :
    '#ffc62d'};
`;

const CancelButton = styled(Button)`
  background: #ff4444;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  margin-top: 0;

  &:hover {
    background: #cc0000;
  }
`;

const ConfirmationModal = styled.div`
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
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const ProfilePage = () => {
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [subscriptions, setSubscriptions] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPersonalDetails({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              phone: data.phone || '',
              dateOfBirth: data.dateOfBirth || '',
              addressLine1: data.addressLine1 || '',
              addressLine2: data.addressLine2 || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const subscriptionsQuery = query(
            collection(db, 'subscriptions'),
            where('customerId', '==', user.uid)
          );
          
          const querySnapshot = await getDocs(subscriptionsQuery);
          const subscriptionData = [];
          
          querySnapshot.forEach((doc) => {
            subscriptionData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setSubscriptions(subscriptionData);
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setSubscriptionError('Failed to load subscriptions');
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDetailsChange = (e) => {
    setPersonalDetails({
      ...personalDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          ...personalDetails,
          updatedAt: new Date(),
        });
        setSuccess('Personal details updated successfully');
      }
    } catch (err) {
      console.error('Error updating details:', err);
      setError('Failed to update personal details');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, passwords.newPassword);
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordSuccess('Password updated successfully');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    setSubscriptionLoading(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'canceled' }
          : sub
      ));

      setShowCancelModal(false);
      setSelectedSubscription(null);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setSubscriptionError('Failed to cancel subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return `$${amount}/month`;
  };

  return (
    <ProfileContainer>
      <Section>
        <SectionTitle>Personal Details</SectionTitle>
        <Form onSubmit={handleDetailsSubmit}>
          <InputGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              name="firstName"
              value={personalDetails.firstName}
              onChange={handleDetailsChange}
              placeholder="First Name"
            />
          </InputGroup>

          <InputGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastName"
              value={personalDetails.lastName}
              onChange={handleDetailsChange}
              placeholder="Last Name"
            />
          </InputGroup>

          <InputGroup>
            <Label>Phone (optional)</Label>
            <Input
              type="tel"
              name="phone"
              value={personalDetails.phone}
              onChange={handleDetailsChange}
              placeholder="Phone Number"
            />
          </InputGroup>

          <InputGroup>
            <Label>Date of Birth (optional)</Label>
            <Input
              type="date"
              name="dateOfBirth"
              value={personalDetails.dateOfBirth}
              onChange={handleDetailsChange}
              placeholder="Date of Birth"
            />
          </InputGroup>

          <InputGroup>
            <Label>Address Line 1 (optional)</Label>
            <Input
              type="text"
              name="addressLine1"
              value={personalDetails.addressLine1}
              onChange={handleDetailsChange}
              placeholder="Address Line 1"
            />
          </InputGroup>

          <InputGroup>
            <Label>Address Line 2 (optional)</Label>
            <Input
              type="text"
              name="addressLine2"
              value={personalDetails.addressLine2}
              onChange={handleDetailsChange}
              placeholder="Address Line 2"
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Details'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
      </Section>

      <Section>
        <SectionTitle>Change Password</SectionTitle>
        <Form onSubmit={handlePasswordSubmit}>
          <InputGroup>
            <Label>Current Password</Label>
            <Input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
            />
          </InputGroup>

          <InputGroup>
            <Label>New Password</Label>
            <Input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
            />
          </InputGroup>

          <InputGroup>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          {passwordSuccess && <SuccessMessage>{passwordSuccess}</SuccessMessage>}
        </Form>
      </Section>

      <Section>
        <SectionTitle>Your Subscriptions</SectionTitle>
        {subscriptionError && <ErrorMessage>{subscriptionError}</ErrorMessage>}
        {subscriptions.length === 0 ? (
          <div style={{ color: '#999' }}>No active subscriptions found.</div>
        ) : (
          subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id}>
              <SubscriptionHeader>
                <SubscriptionInfo>
                  <SubscriptionAmount>
                    {formatPrice(subscription.amount)}
                  </SubscriptionAmount>
                  <div style={{ color: '#999', fontSize: '0.875rem' }}>
                    Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </div>
                </SubscriptionInfo>
                <SubscriptionStatus status={subscription.status}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </SubscriptionStatus>
              </SubscriptionHeader>
              
              {subscription.status === 'active' && (
                <CancelButton
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setShowCancelModal(true);
                  }}
                  disabled={subscriptionLoading}
                >
                  Cancel Subscription
                </CancelButton>
              )}
            </SubscriptionCard>
          ))
        )}
      </Section>

      {showCancelModal && selectedSubscription && (
        <ConfirmationModal>
          <ModalContent>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Cancel Subscription</h3>
            <p style={{ color: '#999', marginBottom: '1rem' }}>
              Are you sure you want to cancel this subscription? This action cannot be undone.
            </p>
            <ModalButtons>
              <Button
                onClick={() => setShowCancelModal(false)}
                style={{ background: '#666' }}
              >
                Keep Subscription
              </Button>
              <CancelButton
                onClick={() => handleCancelSubscription(selectedSubscription.id)}
                disabled={subscriptionLoading}
              >
                {subscriptionLoading ? 'Canceling...' : 'Yes, Cancel'}
              </CancelButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage; 