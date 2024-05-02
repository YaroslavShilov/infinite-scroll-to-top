import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Data, fetchMessages, Message } from "./data.ts";

function App() {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollElem = scrollRef.current;

  useEffect(() => {
    const scrollHandler = () => {
      // If we near the last message, we increase the page
      // then we load new messages.
      // It's important to do it before last message
      // otherwise the scroll will be on the top position all time, even if we load new messages
      if (scrollElem && scrollElem.scrollTop < 240) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    scrollElem?.addEventListener("scroll", scrollHandler);

    return () => scrollElem?.removeEventListener("scroll", scrollHandler);
  }, [scrollRef, scrollElem]);

  useEffect(() => {
    // When our block with messages renders first time with first messages (page 1),
    // we'll put the scroll position to bottom
    if (page === 1 && scrollElem) {
      scrollElem.scrollTop = scrollElem.scrollHeight;
    }
  }, [scrollElem, page]);

  useEffect(() => {
    // When we change the page, we load new messages
    // Fake fetching data, just change to your request
    const data: Data = fetchMessages(page);
    setMessages((messages) => [...data.messages, ...messages]);
  }, [page]);

  return (
    <div className="root">
      <div className="content">
        <div className="header">Infinity scroll to top</div>
        <div className="messages" ref={scrollRef}>
          {messages.map(({ id, text }) => (
            <div key={id} className="message">
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
