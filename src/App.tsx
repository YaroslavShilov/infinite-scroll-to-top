import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Data, fetchMessages, Message } from "./data.ts";

function App() {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollElem = scrollRef.current;
  console.log("scrollElem: ", scrollElem);

  useEffect(() => {
    // When we change the page, we load new messages
    // Fake fetching data, change this part to your request
    setIsLoading(true);
    const data: Data = fetchMessages(page);
    setMessages((messages) => [...data.messages, ...messages]);
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    // When our block with messages renders the first time with the first messages (page 1),
    // we'll put the scroll position at the bottom
    if (page === 1 && scrollElem) {
      console.log("height: ", scrollElem.scrollHeight);
      console.log("before scrollTop: ", scrollElem.scrollTop);
      scrollElem.scrollTop = scrollElem.scrollHeight;
      console.log("after scrollTop: ", scrollElem.scrollTop);
    }
  }, [scrollElem, page]);

  useEffect(() => {
    console.log("handler");
    const scrollHandler = () => {
      // If we near the last message, we increase the page, then we load new messages.
      // (unless we are already loading a new page)
      // It's important to do it before the last message
      // otherwise the scroll will be in the top position all the time, even if we load new messages
      console.log("here1: ", scrollElem && scrollElem.scrollTop);
      console.log("here2: ", scrollElem && scrollElem.scrollHeight);
      if (scrollElem && scrollElem.scrollTop < 300 && !isLoading) {
        console.log("scroll");
        setPage((prevPage) => prevPage + 1);
      }
    };

    scrollElem?.addEventListener("scroll", scrollHandler);
    console.log("added");

    return () => scrollElem?.removeEventListener("scroll", scrollHandler);
  }, [scrollElem, isLoading]);

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
