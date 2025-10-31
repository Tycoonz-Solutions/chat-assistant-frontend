import ChatWidget from "../../src/ChatWidget";

function App() {
  type FAQ = { question: string; ans: string };

  // Demo usage
  const demoFaqs: FAQ[] = [
    {
      question: 'What AI technologies do you work with?',
      ans: 'We work with various AI technologies including machine learning, natural language processing, computer vision, and deep learning frameworks like TensorFlow and PyTorch.',
    },
    {
      question: 'How does AI improve customer experience?',
      ans: 'AI improves customer experience through personalized recommendations, 24/7 chatbot support, predictive analytics, and automated customer service solutions.',
    },
    {
      question: 'What are the ethical implications of AI?',
      ans: 'Ethical implications include bias in algorithms, privacy concerns, job displacement, transparency in decision-making, and the need for responsible AI development.',
    },
    {
      question: 'What role does machine learning play in your projects?',
      ans: 'Machine learning enables us to build predictive models, automate complex tasks, analyze large datasets, and create intelligent systems that improve over time.',
    },
    {
      question: 'How do you ensure data privacy in AI systems?',
      ans: 'We implement encryption, follow GDPR compliance, use anonymization techniques, conduct regular security audits, and maintain strict access controls.',
    },
    {
      question: 'Can you share an example of AI in healthcare?',
      ans: 'AI in healthcare includes diagnostic imaging analysis, drug discovery, personalized treatment plans, patient monitoring systems, and predictive health analytics.',
    },{
      question: 'What AI technologies do you work with?',
      ans: 'We work with various AI technologies including machine learning, natural language processing, computer vision, and deep learning frameworks like TensorFlow and PyTorch.',
    },
    {
      question: 'How does AI improve customer experience?',
      ans: 'AI improves customer experience through personalized recommendations, 24/7 chatbot support, predictive analytics, and automated customer service solutions.',
    },
    {
      question: 'What are the ethical implications of AI?',
      ans: 'Ethical implications include bias in algorithms, privacy concerns, job displacement, transparency in decision-making, and the need for responsible AI development.',
    },
    {
      question: 'What role does machine learning play in your projects?',
      ans: 'Machine learning enables us to build predictive models, automate complex tasks, analyze large datasets, and create intelligent systems that improve over time.',
    },
    {
      question: 'How do you ensure data privacy in AI systems?',
      ans: 'We implement encryption, follow GDPR compliance, use anonymization techniques, conduct regular security audits, and maintain strict access controls.',
    },
    {
      question: 'Can you share an example of AI in healthcare?',
      ans: 'AI in healthcare includes diagnostic imaging analysis, drug discovery, personalized treatment plans, patient monitoring systems, and predictive health analytics.',
    },
  ];



  return (
    <div style={{ padding: 30 }}>
      <ChatWidget title="Help" faqs={demoFaqs} />
    </div>
  );
}

export default App;
