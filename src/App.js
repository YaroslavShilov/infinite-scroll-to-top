import { useEffect, useRef, useState } from "react";
import "./style.css";

function* createId() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const id = createId();

function App() {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef();

  const scrollHandler = () => {
    if (messagesRef.current.scrollTop < 200) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    messagesRef.current.addEventListener("scroll", scrollHandler);
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    return () =>
      messagesRef.current.removeEventListener("scroll", scrollHandler);
  }, [messagesRef]);

  useEffect(() => {
    if (page === 1) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, page]);

  useEffect(() => {
    // fake fetch data
    console.log("start fetching data");
    const data = [];
    for (let i = 0; i < 20; i++) {
      const messageId = id.next().value;
      data.unshift({
        id: messageId,
        text: `Message with id: ${messageId}, page: ${page}`,
      });
    }
    console.log("finish fetching data, data: ", data);
    setMessages((messages) => [...data, ...messages]);
  }, [page]);

  return (
    <div>
      header
      <div className="messages" ref={messagesRef}>
        {messages.map(({ id, text }) => (
          <div key={id} className="message">
            {text}
          </div>
        ))}
      </div>
      footer
    </div>
  );
}

export default App;
