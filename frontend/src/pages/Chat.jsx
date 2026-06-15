import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>CampusGuide AI Chat</h1>

      <input
        type="text"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "400px",
          padding: "10px",
          marginRight: "10px"
        }}
      />

      <button>
        Ask
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>Answer:</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}