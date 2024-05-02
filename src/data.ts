export type Message = {
  id: number;
  text: string;
};

export type Data = {
  messages: Message[];
};

export const fetchMessages = (page: number): Data => {
  console.log("fetching data...");
  const itemsInPage = 30;
  const messages: Message[] = [];
  let idStart = itemsInPage * (page - 1) + 1;
  const idEnd = itemsInPage * page;

  while (idStart <= idEnd) {
    messages.unshift({
      id: idStart,
      text: `Message #${idStart}, page #${page}`,
    });
    idStart++;
  }

  const res: Data = {
    messages: messages || [],
  };
  console.log("finish fetching data, result: ", res);
  return res;
};
