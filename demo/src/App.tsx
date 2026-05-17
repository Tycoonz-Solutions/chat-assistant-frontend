import ChatWidget from "../../src/ChatWidget";
import { createBackendSendMessage } from "../../src/createBackendSendMessage";

function App() {
  type FAQ = { question: string; ans: string };

  const demoFaqs: FAQ[] = [
    {
      question: "What AI technologies do you work with?",
      ans: "We work with various AI technologies including machine learning, natural language processing, computer vision, and deep learning frameworks like TensorFlow and PyTorch.",
    },
    {
      question: "How does AI improve customer experience?",
      ans: "AI improves customer experience through personalized recommendations, 24/7 chatbot support, predictive analytics, and automated customer service solutions.",
    },
    {
      question: "What are the ethical implications of AI?",
      ans: "Ethical implications include bias in algorithms, privacy concerns, job displacement, transparency in decision-making, and the need for responsible AI development.",
    },
    {
      question: "What role does machine learning play in your projects?",
      ans: "Machine learning enables us to build predictive models, automate complex tasks, analyze large datasets, and create intelligent systems that improve over time.",
    },
    {
      question: "How do you ensure data privacy in AI systems?",
      ans: "We implement encryption, follow GDPR compliance, use anonymization techniques, conduct regular security audits, and maintain strict access controls.",
    },
    {
      question: "Can you share an example of AI in healthcare?",
      ans: "AI in healthcare includes diagnostic imaging analysis, drug discovery, personalized treatment plans, patient monitoring systems, and predictive health analytics.",
    },
  ];

  const apiBase = import.meta.env.VITE_API_URL as string | undefined;
  const projectToken = import.meta.env.VITE_PROJECT_TOKEN as string | undefined;

  const sendMessage =
    apiBase && projectToken
      ? createBackendSendMessage({
          apiBaseUrl: apiBase,
          projectToken,
        })
      : undefined;

  return (
    <div style={{ padding: 30 }}>
      <p style={{ marginBottom: 16, fontSize: 14, color: "#475569" }}>
        {sendMessage
          ? "Backend chat (OpenAI) is on. With API URL + project token you also get: pre-chat name/email, then FAQs/chat, then Contact support (ticket or queue + email follow-up)."
          : "FAQ-only mode: set VITE_API_URL and VITE_PROJECT_TOKEN in the frontend .env for backend chat and the full visitor flow."}
      </p>
      <ChatWidget
        title="Help by chatbot"
        faqs={sendMessage ? undefined : demoFaqs}
        sendMessage={sendMessage}
        apiBaseUrl={apiBase}
        projectToken={projectToken}
      />
    </div>
  );
}

export default App;
