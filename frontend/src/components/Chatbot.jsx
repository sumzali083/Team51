import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Products & Inventory
    if (msg.includes('product') || msg.includes('item') || msg.includes('clothes')) {
      return "We offer a wide range of clothing for Men, Women, and Kids! You can browse our collections from the navigation menu.";
    }
    if (msg.includes('men') && (msg.includes('clothing') || msg.includes('wear'))) {
      return "Our Men's collection includes hoodies, t-shirts, jackets, joggers, shorts, and accessories. Check out the 'Mens' section for all items!";
    }
    if (msg.includes('women') && (msg.includes('clothing') || msg.includes('wear'))) {
      return "Our Women's collection features crop tees, hoodies, jackets, joggers, and leggings. Visit the 'Womens' page to see our full range.";
    }
    if (msg.includes('kids') || msg.includes('children')) {
      return "We have a great Kids collection with hoodies, jackets, joggers, leggings, tees, and shorts. Head to the 'Kids' section to explore.";
    }

    // Pricing
    if (msg.includes('price') || msg.includes('cost') || msg.includes('expensive') || msg.includes('how much')) {
      return "Our prices range from £19.99 to £59.99 depending on the item. You can view specific prices on each product page.";
    }

    // Shipping & Delivery
    if (msg.includes('ship') || msg.includes('deliver')) {
      return "We offer standard shipping for £8.00 and free shipping on orders over £50! Delivery usually takes 3-5 business days.";
    }
    if (msg.includes('track') || msg.includes('order status')) {
      return "You can track your order by logging into your account and viewing your order history. You'll also receive tracking via email.";
    }

    // Sizing
    if (msg.includes('size') || msg.includes('sizing') || msg.includes('fit')) {
      return "Most of our items come in sizes XS, S, M, L, XL, and XXL. Each product page has a detailed size guide - check the 'Size Guide' tab!";
    }

    // Returns & Exchanges
    if (msg.includes('return') || msg.includes('exchange') || msg.includes('refund')) {
      return "We offer a 30-day return policy on all unworn items with tags attached. Exchanges are free, and refunds take 5-10 business days.";
    }

    // Payment
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('card')) {
      return "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and PayPal. All payments are secure and encrypted.";
    }

    // Cart & Checkout
    if (msg.includes('cart') || msg.includes('basket') || msg.includes('checkout')) {
      return "You can add items to your cart and checkout anytime. Just click 'Add to Basket' on any product, then visit your cart to proceed.";
    }

    // Account
    if (msg.includes('account') || msg.includes('register') || msg.includes('sign up') || msg.includes('login')) {
      return "You can create an account to save your information, track orders, and checkout faster. Click 'Login/Profile' in the top right!";
    }

    // Contact & Support
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help') || msg.includes('customer service')) {
      return "You can reach our customer support team through our Contact page. We're here to help Monday-Friday, 9am-5pm GMT.";
    }

    // About
    if (msg.includes('about') || msg.includes('company') || msg.includes('who are you')) {
      return "We're a family-owned clothing retailer dedicated to providing quality, comfortable, and stylish clothing for everyone.";
    }

    // Stock & Availability
    if (msg.includes('stock') || msg.includes('available') || msg.includes('out of stock')) {
      return "If an item is out of stock, you'll see a notification on the product page. We restock popular items regularly!";
    }

    // Discounts & Sales
    if (msg.includes('discount') || msg.includes('sale') || msg.includes('coupon') || msg.includes('promo')) {
      return "We regularly run sales and promotions! Sign up for our newsletter to be the first to know about discounts and special offers.";
    }

    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! How can I assist you today? Feel free to ask me about our products, shipping, returns, or anything else!";
    }
    if (msg.includes('thank') || msg.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with today?";
    }
    if (msg.includes('bye') || msg.includes('goodbye')) {
      return "Goodbye! Thanks for visiting us today. Happy shopping! 👋";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n• Our products and categories\n• Shipping and delivery\n• Sizing and fit guides\n• Returns and exchanges\n• Payment options\n• Order tracking\n• Account creation";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const quickQuestions = [
    "What products do you have?",
    "Shipping information",
    "Size guide",
    "Return policy"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
    // Auto-send after 300ms
    setTimeout(() => {
      if (input === question) {
        const e = { preventDefault: () => {} };
        handleSend(e);
      }
    }, 300);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <h3>Shopping Assistant</h3>
              <span className="status">
                <span className="status-dot"></span> Online
              </span>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <div className="quick-buttons">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q)}
                    className="quick-btn"
                    type="button"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className={!input.trim() ? 'disabled' : ''}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;