import React from 'react';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  margin-bottom: 2rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;

  h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuestionLink = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.05)' : 'none'};
  border: none;
  color: ${props => props.active ? 'white' : '#999'};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const ContentCard = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  p {
    color: #999;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    white-space: pre-line;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    color: #999;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FAQDetail = () => {
  const navigate = useNavigate();
  const { category, question } = useParams();

  // This would typically come from your API or data store
  const categoryQuestions = {
    'new-with-acit': {
      title: 'New with ACIT',
      questions: [
        'How to start?',
        'Is ACIT a trustworthy company?',
        'What is ACIT?',
        'Where is your office? How do I contact you?',
        'Who can join ACIT?',
        'Why should I join ACIT?'
      ]
    },
    'evaluation-process': {
      title: 'Evaluation Process',
      questions: [
        'How do I become an ACIT Trader?',
        'How long does it take to become an ACIT trader?',
        'I have successfully passed my ACIT Challenge, now what?',
        'What will be the size of my ACIT Account?'
      ]
    },
    'rules': {
      title: 'Rules',
      questions: [
        'Step 1 ACIT Challenge?',
        'Step 2 Verification?',
        'Step 3 ACIT Account?',
        'Can I trade news?',
        'Do I have to close my positions overnight?',
        'Which instruments can I trade and what strategies am I allowed to use?',
        'What is Trading according to a real market?'
      ]
    },
    'acit-traders-account': {
      title: 'ACIT Traders Account',
      questions: [
        'What is the legal relationship between an ACIT trader and ACIT after signing the ACIT Account Agreement?',
        'What account size will I work with?',
        'How does ACIT Account work from the technical side?',
        'How do I withdraw my reward?',
        'Do I have to tax my income?'
      ]
    },
    'platforms': {
      title: 'Platforms',
      questions: [
        'Can I change my platform during the Evaluation Process?',
        'What are the account specifications?',
        'Which platforms can I use for trading?',
        'How does the ACIT technical infrastructure work?',
        'Can I modify my current account?'
      ]
    },
    'orders-billing': {
      title: 'Orders & Billing',
      questions: [
        'How do I apply for an ACIT Challenge?',
        'What payment methods are available?',
        'Do we charge any other fees? Are the fees recurrent?',
        'I paid for my ACIT Challenge, when will I get the account?',
        'Why is there a fee?',
        'How many accounts can I have?'
      ]
    }
  };

  // Add answers for each question
  const answers = {
    // New with ACIT
    'how to start?': {
      content: [
        'Starting with ACIT Trading is a straightforward process:',
        '1. Create an account on our platform',
        '2. Choose your preferred account size ($10,000, $25,000, $50,000, $100,000, or $200,000)',
        '3. Complete the one-time payment for your chosen challenge',
        '4. Receive your login credentials',
        '5. Begin trading according to our objective rules',
        'Our evaluation process consists of two steps: the ACIT Challenge and the Verification. Once you successfully complete both phases, you\'ll become an ACIT Trader with a funded account.'
      ]
    },
    'is acit a trustworthy company?': {
      content: [
        'Yes, ACIT is a trusted and reliable proprietary trading firm:',
        '• Registered and regulated business entity',
        '• Transparent trading conditions and rules',
        '• Proven track record of successful traders',
        '• Regular and reliable payouts',
        '• Professional customer support',
        '• Strong reputation in the trading community',
        'We maintain high standards of integrity and transparency in all our operations, ensuring a secure and professional environment for our traders.'
      ]
    },
    'what is acit?': {
      content: [
        'ACIT (Ascendant Capital Investments Trading) is a proprietary trading firm that:',
        '• Provides funding opportunities for skilled traders',
        '• Offers account sizes from $10,000 to $200,000',
        '• Uses a two-step evaluation process',
        '• Shares up to 95% of trading profits',
        '• Maintains professional trading infrastructure',
        'Our mission is to identify and support talented traders while providing them with the capital and tools needed for success in the financial markets.'
      ]
    },
    'where is your office? how do i contact you?': {
      content: [
        'ACIT maintains offices in multiple locations:',
        'Main Office:',
        '• Headquarters: Edmonton, United Kingdom',
        '• Support Center: Edmonton, United Kingdom',
        'Contact Methods:',
        '• Email: support@acitrading.ca',
        '• Live Chat: Available 24/7 on our platform',
        '• Phone: Available during business hours',
        '• Social Media: Active presence on major platforms',
        'Response Times:',
        '• General Inquiries: Within 24 hours',
        '• Technical Support: Within 2-4 hours',
        '• Emergency Issues: Immediate attention'
      ]
    },
    'who can join acit?': {
      content: [
        'ACIT welcomes traders from diverse backgrounds:',
        'Eligible Participants:',
        '• Experienced traders',
        '• Beginner traders with proper knowledge',
        '• Individual traders',
        '• Trading teams',
        'Requirements:',
        '• Must be 18 years or older',
        '• Access to stable internet connection',
        '• Ability to follow trading rules',
        'We do not discriminate based on:',
        '• Geographic location',
        '• Trading experience level',
        '• Account size preference'
      ]
    },
    'why should i join acit?': {
      content: [
        'ACIT offers numerous advantages for traders:',
        'Key Benefits:',
        '• Access to significant trading capital',
        '• Up to 95% profit sharing',
        '• No risk to personal capital',
        '• Professional trading environment',
        'Additional Advantages:',
        '• Flexible trading conditions',
        '• Multiple account options',
        '• Comprehensive support',
        '• Regular payouts',
        'Career Development:',
        '• Scaling opportunities',
        '• Professional network',
        '• Performance tracking',
        '• Educational resources'
      ]
    },
    // Evaluation Process
    'how do i become an acit trader?': {
      content: [
        'The path to becoming an ACIT trader involves two main steps:',
        '1. ACIT Challenge:',
        '• Trade with your chosen account size with fictitious capital',
        '• Meet the profit target (10%)',
        '• Follow trading rules and risk management',
        '2. Verification:',
        '• Demonstrate consistent trading',
        '• Lower profit target (5%)',
        '• Same trading rules apply',
        'After successfully completing both phases, you\'ll receive your funded account with real capital.'
      ]
    },
    'how long does it take to become an acit trader?': {
      content: [
        'The time to become an ACIT trader varies based on your trading style and performance:',
        '• Minimum Trading Days: 4 days in each phase',
        '• No Maximum Time Limit: Trade at your own pace',
        '• Average Completion Time: 1-2 months',
        '• Fast Track Option: Available for exceptional performance',
        'We believe in quality over speed, allowing traders to develop their strategy properly.'
      ]
    },
    'i have successfully passed my acit challenge, now what?': {
      content: [
        'Congratulations! After passing the ACIT Challenge, here\'s what happens:',
        '1. Automatic Progression: You\'ll receive verification account credentials within 24 hours',
        '2. Same Trading Conditions: Continue with the same platform and rules',
        '3. Lower Targets: 5% profit target for verification',
        '4. Account Setup: Once verification is passed, your funded account will be set up within 48 hours',
        '5. Start Trading Real Capital: Begin trading with our capital and earn up to 95% of the profits'
      ]
    },
    'what will be the size of my acit account?': {
      content: [
        'Your ACIT account size depends on your initial challenge choice:',
        '• Standard Accounts: $10,000, $25,000, $50,000, $100,000, or $200,000',
        '• Scaling Opportunities: Increase account size based on performance',
        '• Account Maintenance: Keep the same size as long as you follow the rules',
        '• Multiple Accounts: Option to manage several accounts simultaneously',
        'All accounts come with the same profit-sharing structure and trading conditions.'
      ]
    },
    // Rules
    'step 1 acit challenge': {
      content: [
        'ACIT Challenge - First Step Requirements:',
        '• Trading Period: Unlimited',
        '• Minimum Trading Days: 4',
        '• Maximum Daily Loss: 10%',
        '• Maximum Total Loss: 15%',
        '• Profit Target: 10%',
        '• Weekend holding is allowed',
        '• News trading is allowed',
        'Successfully completing these requirements allows progression to Step 2.'
      ]
    },
    'step 2 verification': {
      content: [
        'Verification Phase Requirements:',
        '• Trading Period: Unlimited',
        '• Minimum Trading Days: 4',
        '• Maximum Daily Loss: 10%',
        '• Maximum Total Loss: 15%',
        '• Profit Target: 5%',
        '• Weekend holding is allowed',
        '• News trading is allowed',
        'Passing verification leads to receiving your ACIT Traders Account.'
      ]
    },
    'step 3 acit account': {
      content: [
        'ACIT Traders Account Features:',
        '• Access to increased capital up to $1,000,000',
        '• Up to 95% profit share',
        '• Monetized demo environment',
        '• No time limit',
        '• Same trading rules apply:',
        '  - Maximum Daily Loss: 10%',
        '  - Maximum Total Loss: 15%',
        '  - Weekend holding is allowed',
        '  - News trading is allowed',
        'Maintain consistent performance to unlock scaling opportunities.',
        'Additional Information: Our funded Ascendant Traders cannot risk more than 2% of their account size in a single trade.',
      ]
    },
    'can i trade news?': {
      content: [
        'Yes, you can trade during news events with ACIT, but with some considerations:',
        '• Major news events may have wider spreads',
        '• Ensure proper risk management',
        '• Be aware of potential slippage',
        '• Monitor your positions carefully',
        'We recommend:',
        '• Using appropriate position sizing',
        '• Setting wider stops during news events',
        '• Being prepared for increased volatility'
      ]
    },
    'do i have to close my positions overnight?': {
      content: [
        'Position holding rules at ACIT:',
        '• Weekday Overnight Holding: Allowed',
        '• Weekend Holding: Is permitted',
        '• Swap Fees/Commissions: Apply to Drawdown rules',
        'Note: Special rules may apply during major market events or holidays.'
      ]
    },
    'which instruments can i trade and what strategies am i allowed to use?': {
      content: [
        'ACIT offers a wide range of trading instruments and strategies:',
        'Available Instruments:',
        '• Forex Major and Minor pairs',
        '• Indices',
        '• Commodities',
        '• Cryptocurrencies',
        'Allowed Strategies:',
        '• Manual Trading',
        '• Semi-Automated Trading',
        '• Scalping',
        '• Day Trading',
        '• Swing Trading',
        'Prohibited:',
        '• High-Frequency Trading',
        '• Market Manipulation',
      ]
    },
    'what is trading according to a real market?': {
      content: [
        'Trading according to real market conditions means:',
        '• Real-time market prices',
        '• Actual market spreads',
        '• Genuine market depth',
        '• Authentic order execution',
        'We ensure this by:',
        '• Using top-tier liquidity providers',
        '• Maintaining professional trading infrastructure',
        '• Providing institutional-grade execution',
        '• Offering transparent trading conditions'
      ]
    },
    // ACIT Traders Account
    'what is the legal relationship between an acit trader and acit after signing the acit account agreement?': {
      content: [
        'The legal relationship between ACIT and traders is structured as follows:',
        '• Independent Contractor Status: Traders are not employees',
        '• Profit-Sharing Agreement: Clear terms for profit distribution',
        '• Risk Management Framework: Defined trading parameters',
        '• Intellectual Property: Your trading strategy remains yours',
        '• Confidentiality: Mutual protection of sensitive information',
        'The agreement ensures a professional and transparent partnership while protecting both parties\' interests.',
        'The relationship between an ACIT Trader and ACIT is based on the ACIT Account Agreement that we will sign with you after you pass your ACIT Challenge and Verification as well as the KYC/KYB process. Please note that your status (Natural Person, Legal Entity) will be based on the option you selected during your first order purchase, depending on whether you purchased it as a Natural Person or a Legal Entity. You can request a change only once, after successfully completing your ACIT Challenge and Verification, or following your Reward payment as an ACIT Trader, but before starting your next trading cycle.',
      ]
    },
    'what account size will i work with?': {
      content: [
        'ACIT offers various account sizes to suit different trading styles:',
        'Available Account Sizes:',
        '• $50,000 Account',
        '• $100,000 Account',
        '• $200,000 Account',
        'Each account includes:',
        '• Same profit-sharing terms',
        '• Identical trading conditions',
        '• Scaling opportunities',
        '• Professional support'
      ]
    },
    'how does acit account work from the technical side?': {
      content: [
        'ACIT accounts are built on robust technical infrastructure:',
        'Technical Features:',
        '• Advanced trading platforms (MT4/MT5)',
        '• Real-time data feeds',
        '• Professional execution',
        '• Secure login system',
        'Infrastructure:',
        '• Low-latency servers',
        '• Multiple data centers',
        '• Backup systems',
        '• 24/7 technical support',
        'After a client becomes an ACIT Trader, they will be provided with a demo account with fictitious capital.  An ACIT Account is an account with fully fictitious funds, however, with real market quotes from liquidity providers. Please note that, for ACIT Account purposes, liquidity providers do not provide us or ACIT Traders with any real money Liquidity, only with the market quotes. Our clients therefore never actually perform any trades on live markets. In a separate process, ACIT also trades on its own account outside of the ACIT platform with real financial means. While performing its own trades, ACIT may also use trading data obtained from its clients ACIT Accounts.  ACIT continuously monitors and analyses the trades executed by ACIT Traders in the demo environment and subsequently evaluates whether trades will be executed for ACITs own account. This execution occurs without any impact on ACIT clients and their simulated trading. These two processes are separate and in no way is the ACIT Trader influenced by ACIT trading.'
      ]
    },
    'how do i withdraw my reward?': {
      content: [
        'Withdrawing profits from your ACIT account is straightforward:',
        'Withdrawal Process:',
        '1. Request withdrawal through dashboard',
        '2. Choose payment method',
        '3. Verify account details',
        '4. Receive funds within 24-48 hours',
        'Available Payment Methods:',
        '• Bank Transfer',
        '• Cryptocurrency',
        '• E-Transfer for Canadian Traders',
        'Note: Even though ACIT Traders trade with fictitious capital only, they are entitled to obtain a reward in the form of real money if they can generate "profit" on an ACIT Account.  Meaning if they are able to trade the fictitious capital in a way that is profitable, proving their skills and the value of data provided in the process, they will receive a reward.'
      ]
    },
    'do i have to tax my income?': {
      content: [
        'Regarding taxation of trading profits:',
        '• Traders are responsible for their own tax obligations',
        '• Tax requirements vary by country',
        '• Consult with a tax professional',
        'We recommend:',
        '• Keeping detailed trading records',
        '• Understanding local tax laws',
        '• Setting aside funds for tax payments',
        'Note: Please bear in mind that you are solely responsible and liable for the payment of any and all taxes, levies, or fees that apply to you in relation to the ACIT Account Agreement under the applicable laws and regulations. ACIT is neither able nor authorised to provide any tax advice or instructions.'
      ]
    },
    // Platforms
    'can i change my platform during the evaluation process?': {
      content: [
        'Platform flexibility during evaluation:',
        '• Changes allowed between phases',
        '• Must complete current phase before switching',
        '• Same account credentials',
        '• No additional fees',
        'Available Platforms:',
        '• MetaTrader 4',
        '• MetaTrader 5',
        'Note: Settings and preferences may need to be reconfigured after switching.'
      ]
    },
    'what are the account specifications?': {
      content: [
        'ACIT account specifications include:',
        'Trading Conditions:',
        '• Leverage: Up to 1:200',
        '• Spread: Market standard',
        '• Commission: Competitive rates',
        '• Minimum Lot Size: 0.01',
        'Technical Specs:',
        '• Real-time execution',
        '• No requotes',
        '• Multiple order types',
        '• Advanced charting tools'
      ]
    },
    'which platforms can i use for trading?': {
      content: [
        'ACIT supports industry-standard trading platforms:',
        'Available Platforms:',
        '• MetaTrader 4 (MT4)',
        '• MetaTrader 5 (MT5)',
        'Features:',
        '• Custom indicators',
        '• Advanced charting',
        '• Mobile trading',
        '• Multiple timeframes',
        'All platforms include:',
        '• Real-time data',
        '• Professional tools',
        '• Technical analysis features'
      ]
    },
    'how does the acit technical infrastructure work?': {
      content: [
        'ACIT\'s technical infrastructure is built for reliability:',
        'Key Components:',
        '• High-speed servers',
        '• Multiple data centers',
        '• Redundant systems',
        '• Real-time monitoring',
        'Features:',
        '• Low latency execution',
        '• 99.9% uptime',
        '• Automated backup systems',
        '• 24/7 technical support'
      ]
    },
    'can i modify my current account?': {
      content: [
        'Account modification options at ACIT:',
        'Available Modifications:',
        '• Upgrade account size',
        '• Change trading platform',
        '• Update payment methods',
        '• Adjust notification settings',
        'Process:',
        '1. Submit modification request',
        '2. Receive approval',
        '3. Implementation within 24 hours',
        'Note: Some changes may require completing current trading phase.'
      ]
    },
    // Orders & Billing
    'how do i apply for an acit challenge?': {
      content: [
        'Applying for an ACIT Challenge is simple:',
        'Application Steps:',
        '1. Create an account on our website',
        '2. Select your preferred account size',
        '3. Choose payment method',
        '4. Complete the purchase',
        '5. Receive login credentials',
        'Requirements:',
        '• Valid email address',
        '• Acceptance of terms',
        'Processing time: Within a few hours'
      ]
    },
    'what payment methods are available?': {
      content: [
        'ACIT accepts various payment methods:',
        'Available Options:',
        '• Credit/Debit Cards',
        '• Cryptocurrency (BTC, ETH, USDT)',
        'Features:',
        '• Instant processing for most methods',
        '• Secure transactions',
        '• Multiple currencies accepted',
        'Note: 25% discount available on crypto payments'
      ]
    },
    'do we charge any other fees are the fees recurrent': {
      content: [
        'ACIT fee structure is transparent:',
        'One-time Fees:',
        '• Challenge fee (refundable upon success)',
        '• No hidden charges',
        'No Recurring Fees:',
        '• No monthly subscriptions',
        '• No platform fees',
        '• No data fees',
        'Additional Information:',
        '• Refund policy available',
        '• Clear fee structure',
        '• No surprise charges'
      ]
    },
    'i paid for my acit challenge, when will i get the account?': {
      content: [
        'Account activation timeline after payment:',
        'Normal Processing:',
        '• Payment confirmation: Immediate',
        '• Account creation: Within a few hours',
        '• Login credentials: Sent via email',
        'Next Steps:',
        '1. Check email for credentials',
        '2. Download trading platform',
        '3. Begin trading'
      ]
    },
    'why is there a fee?': {
      content: [
        'The ACIT Challenge fee serves multiple purposes:',
        'Fee Justification:',
        '• Risk management for capital allocation',
        '• Platform and infrastructure costs',
        '• Support service maintenance',
        '• Verification of serious traders',
        'Benefits:',
        '• Refundable upon success',
        '• Access to significant trading capital',
        '• Professional trading environment',
        '• Comprehensive support services'
      ]
    },
    'how many accounts can i have?': {
      content: [
        'ACIT account limits and options:',
        'Account Rules:',
        '• Multiple accounts allowed',
        '• Different account sizes possible',
        '• Separate tracking for each account',
        'Limitations:',
        '• Maximum of 5 active challenges',
        '• Maximum of 5 funded accounts',
        '• Total of 10 active accounts',
        'Benefits:',
        '• Diversify trading strategies',
        '• Scale your trading business',
        '• Manage different risk profiles'
      ]
    }
  };

  // Get the current category info
  const getCurrentCategory = () => {
    if (categoryQuestions[category]) {
      return categoryQuestions[category];
    }
    // Handle special cases and format the title
    const title = category
      ? category
          .split('-')
          .map(word => word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : '';
    return { title, questions: [] };
  };

  const currentCategory = getCurrentCategory();

  // Update the question decoding
  const decodedQuestion = decodeURIComponent(question)
    .replace(/-/g, ' ')
    .toLowerCase()
    .trim();

  // Find the original question from the category questions
  const originalQuestion = currentCategory.questions.find(q => 
    q.toLowerCase().replace(/[?]/g, '').trim() === decodedQuestion
  ) || decodedQuestion;

  // Get the answer key from the original question
  const getAnswerKey = (q) => {
    const normalized = q.toLowerCase().trim();
    // Try exact match first
    if (answers[normalized]) {
      return normalized;
    }
    // Try without question mark and with spaces instead of hyphens
    const withoutQuestion = normalized
      .replace(/[?]/g, '')
      .replace(/-/g, ' ')
      .trim();
    if (answers[withoutQuestion]) {
      return withoutQuestion;
    }
    // Try with question mark
    const withQuestion = withoutQuestion + '?';
    if (answers[withQuestion]) {
      return withQuestion;
    }
    return withoutQuestion;  // Return the version with spaces instead of hyphens
  };

  const answerKey = getAnswerKey(originalQuestion);
  const currentAnswer = answers[answerKey];

  // Debug logging
  console.log('Category:', category);
  console.log('Decoded question:', decodedQuestion);
  console.log('Original question:', originalQuestion);
  console.log('Answer key:', answerKey);
  console.log('Available answer keys:', Object.keys(answers));
  console.log('Found answer:', currentAnswer);

  // Handle question click with proper formatting
  const handleQuestionClick = (q) => {
    const formattedQuestion = q.toLowerCase()
      .replace(/[?]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    navigate(`/dashboard/faq/${category}/${formattedQuestion}`);
  };

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/dashboard/faq')}>
        <ChevronLeft size={20} />
        Back to FAQ
      </BackButton>

      <ContentGrid>
        <Sidebar>
          <h3>{currentCategory.title}</h3>
          <QuestionList>
            {currentCategory.questions.map((q) => (
              <QuestionLink
                key={q}
                active={q.toLowerCase().replace(/[?]/g, '').trim() === decodedQuestion}
                onClick={() => handleQuestionClick(q)}
              >
                {q}
              </QuestionLink>
            ))}
          </QuestionList>
        </Sidebar>

        <ContentCard>
          <h1>{originalQuestion}</h1>
          {currentAnswer ? (
            currentAnswer.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>Content for this question will be available soon.</p>
          )}
        </ContentCard>
      </ContentGrid>
    </DetailContainer>
  );
};

export default FAQDetail; 