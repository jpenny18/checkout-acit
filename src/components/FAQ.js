import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQContainer = styled.div`
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

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(42, 42, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #ffc62d;
  }

  &::placeholder {
    color: #666;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 1.2rem;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.5;
  }
`;

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
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
    {
      title: 'Evaluation Process',
      questions: [
        'How do I become an ACIT Trader?',
        'How long does it take to become an ACIT trader?',
        'I have successfully passed my ACIT Challenge, now what?',
        'What will be the size of my ACIT Account?'
      ]
    },
    {
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
    {
      title: 'ACIT Traders Account',
      questions: [
        'What is the legal relationship between an ACIT trader and ACIT after signing the ACIT Account Agreement?',
        'What account size will I work with?',
        'How does ACIT Account work from the technical side?',
        'How do I withdraw my reward?',
        'Do I have to tax my income?'
      ]
    },
    {
      title: 'Platforms',
      questions: [
        'Can I change my platform during the Evaluation Process?',
        'What are the account specifications?',
        'Which platforms can I use for trading?',
        'How does the ACIT technical infrastructure work?',
        'Can I modify my current account?'
      ]
    },
    {
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
  ];

  const filteredCategories = searchQuery
    ? categories.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
          q.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : categories;

  const handleQuestionClick = (category, question) => {
    // Format the category name: lowercase, replace spaces and ampersands with hyphens
    const formattedCategory = category.toLowerCase()
      .replace(/[\s&]+/g, '-')  // Replace spaces and ampersands with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();

    // Format the question: lowercase, remove question marks, replace spaces with hyphens
    const formattedQuestion = question.toLowerCase()
      .replace(/[?]/g, '')      // Remove question marks
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();

    navigate(`/dashboard/faq/${formattedCategory}/${formattedQuestion}`);
  };

  return (
    <FAQContainer>
      <SearchContainer>
        <SearchBar>
          <Search size={20} />
          <SearchInput
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      </SearchContainer>

      <Grid>
        {filteredCategories.map((category) => (
          <Card key={category.title}>
            <h2>{category.title}</h2>
            <QuestionList>
              {category.questions.map((question) => (
                <QuestionLink
                  key={question}
                  onClick={() => handleQuestionClick(category.title, question)}
                >
                  {question}
                  <ChevronRight size={16} />
                </QuestionLink>
              ))}
            </QuestionList>
          </Card>
        ))}
      </Grid>
    </FAQContainer>
  );
};

export default FAQ; 