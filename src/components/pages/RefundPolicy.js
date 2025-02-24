import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #ffc62d;
  margin-bottom: 2rem;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #ffc62d;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #ccc;
`;

const RefundPolicy = () => {
  return (
    <Container>
      <Title>Refund & Dispute Policy</Title>
      
      <Section>
        <Text>
          In this Refund Policy, "us," "our," and "we" refer to ACI Trading LTD. / Ascendant Capital Investments LTD. (trading as ACI Trading).
        </Text>
      </Section>

      <Section>
        <SectionTitle>No Refunds Post-Purchase</SectionTitle>
        <Text>
          Once a purchase has been completed and evaluation credentials have been sent to the customer, no refunds will be granted under any circumstances. Therefore, all sales are final.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Refunds After Completing the Evaluation Program</SectionTitle>
        <Text>
          If you successfully complete the ACI Trading Evaluation and enter into a formal agreement for the proprietary trading phase, you will be eligible to receive a refund of your initial evaluation fee. This refund will be processed alongside your second successful profit split payment. No refund of the evaluation fee will be made until you have reached the second profit split.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Acceptance of this Policy</SectionTitle>
        <Text>
          By placing an order with ACI Trading LTD, you acknowledge that you have read, understood, and agreed to this Refund Policy as well as our Evaluation Terms and Conditions. These terms are an integral part of your agreement with us for the purchase of ACI Trading Evaluations. If you do not agree with these terms, you should not place an order. Should you have any questions about our refund policy, please contact us at support@ascendantcapital.ca.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Chargebacks</SectionTitle>
        <Text>
          You expressly agree not to initiate any chargeback claims for payments made to ACI Trading, via credit card or any other method, without first contacting us. Should a chargeback claim be made, ACI Trading reserves the right to suspend your Membership Accounts or Evaluation Accounts and pause and/or cancel any pending profit split payments. Additionally, we may recover any amounts already paid to you from these accounts, including but not limited to profit splits. You further agree to bear all costs incurred by ACI Trading in defending against any chargeback claims, including legal fees, regardless of the outcome.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Changes to This Policy</SectionTitle>
        <Text>
          We reserve the right to update or amend this Refund Policy at any time. Any updates will take effect immediately upon being posted on our website.
        </Text>
        <Text>
          By making purchases with ACI Trading, you agree to comply with this Refund Policy. If you have any concerns, please reach out to our Customer Support team.
        </Text>
      </Section>
    </Container>
  );
};

export default RefundPolicy; 