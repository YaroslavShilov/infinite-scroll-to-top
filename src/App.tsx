import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Data, fetchMessages, Message } from "./data.ts";

function App() {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollHandlerCount, setScrollHandlerCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollElem = scrollRef.current;

  useEffect(() => {
    // When we change the page, we load new messages
    // Fake fetching data, change this part to your request
    setIsLoading(true);
    const data: Data = fetchMessages(page);
    setMessages((messages) => [...data.messages, ...messages]);
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    const scrollHandler = () => {
      /*
       * We're checking the scroll position during scrolling.
       * If we near the last message, we increase the page, then we load new messages (in useEffect).
       * (unless we are already loading a new page)
       * It's important to do it before the last message
       * otherwise the scroll will be in the top position all the time, even if we load new messages
       * */
      if (scrollElem && scrollElem.scrollTop < 300 && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }

      /*
       * When our block with messages renders the first time with the first messages (page 1),
       * we'll put the scroll position at the bottom.
       * In my situation, fonts load later than JS, after that the scroll position isn't at the bottom.
       * I check it in this "if" and fix the scroll position.
       * !!!BUT if you load fonts before the page with these messages, you can remove this "if" block.
       * */
      if (scrollElem && scrollHandlerCount < 3) {
        scrollElem.scrollTop = scrollElem.scrollHeight;
        setScrollHandlerCount(scrollHandlerCount + 1);
      }
    };

    scrollElem?.addEventListener("scroll", scrollHandler);

    return () => scrollElem?.removeEventListener("scroll", scrollHandler);
  }, [scrollElem, isLoading, scrollHandlerCount]);

  /*
   * When our block with messages renders the first time with the first messages (page 1),
   * we'll put the scroll position at the bottom.
   * */
  useEffect(() => {
    if (scrollElem && page === 1) {
      scrollElem.scrollTop = scrollElem.scrollHeight;
    }
  }, [scrollElem, page]);

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
