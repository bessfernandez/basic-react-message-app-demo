import React, { Component, useState } from "react";
import { render } from "react-dom";
import "./style.css";

// This is the list of messages.
import { messages } from "./data.json";

// utility method - sort messages by date and order
const sortMessagesByDate = (messages, sortOrder = "asc") => {
  const sortedMessages = [...messages];

  var sortMessage = sortedMessages.sort((itemA, itemB) => {
    if (sortOrder === "desc") {
      return new Date(itemB.sentAt) - new Date(itemA.sentAt);
    } else {
      return new Date(itemA.sentAt) - new Date(itemB.sentAt);
    }
  });

  return sortMessage;
};

// utility method - create new array reduced to unique messages
const filteredMessages = messages => {
  const filteredArr = messages.reduce((acc, current) => {
    const duplicatedMatch = acc.find(
      item => item.content === current.content && item.uuid === current.uuid
    );
    if (!duplicatedMatch) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return filteredArr;
};

// Message app
const App = function() {
  const initialOrder = "asc";
  const messageLimit = 5;

  const initialMessages = sortMessagesByDate(
    filteredMessages(messages),
    initialOrder
  );
  const [userMessages, setUserMessages] = useState(initialMessages);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState(messageLimit);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const formatDate = (sentDate, locale = "en-US") => {
    let date = new Date(sentDate);

    // make human readable format based on locale
    let formatedDate = new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "short"
    }).format(date);

    return formatedDate;
  };

  const handleSelectChange = event => {
    const order = event.target.value;
    var sortedMessages = sortMessagesByDate(userMessages, order);

    if (sortedMessages) {
      // update state with new order
      setUserMessages(sortedMessages);
      setSortOrder(order);
    }
  };

  const handleCloseMessage = messageIndex => {
    var messages = [...userMessages];

    if (messageIndex !== -1) {
      // remove message via index and update state
      messages.splice(messageIndex, 1);
      setUserMessages(messages);
    }
  };

  const handleLoadClick = event => {
    // increment currently displayed messages by initial messageLimit
    setCurrentDisplayIndex(currentDisplayIndex + messageLimit);
  };

  return (
    <React.Fragment>
      <h1>Chat Messages</h1>
      <h2>Sort by</h2>
      <select onChange={handleSelectChange} value={sortOrder}>
        <option value="asc">Ascending Date</option>
        <option value="desc">Descending Date</option>
      </select>
      <h2>Messages</h2>
      <ul>
        {userMessages.map((message, index) => {
          {
            /* Display messages based on current display index */
          }
          if (index < currentDisplayIndex) {
            return (
              <li key={index}>
                <div className="card">
                  <button
                    type="button"
                    class="close-message"
                    onClick={() => handleCloseMessage(index)}
                  >
                    Close message
                  </button>
                  <p>From user: {message.senderUuid}</p>
                  <p>Sent: {formatDate(message.sentAt)}</p>
                  <p className="message-body">{message.content}</p>
                </div>
              </li>
            );
          }
        })}
      </ul>
      {!userMessages.length && <p>No new messages!</p>}
      {currentDisplayIndex < userMessages.length && (
        <button type="button" onClick={handleLoadClick}>
          Load more messages
        </button>
      )}
    </React.Fragment>
  );
};

render(<App />, document.getElementById("root"));
