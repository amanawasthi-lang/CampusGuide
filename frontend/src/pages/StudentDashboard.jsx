import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem("name") || "Student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAskAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error connecting to AI.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4)",
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
          }}
        >
          <h1>🎓 CampusGuide AI</h1>

          <h2>Welcome, {userName}</h2>

          <p>
            Ask any university-related question and get instant answers.
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Logout
          </button>
        </div>

        {/* Question Box */}
        <div
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.15)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
          }}
        >
          <h2>Ask University Question</h2>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about syllabus, fees, hostel, exams..."
            style={{
              width: "100%",
              height: "150px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "none",
              padding: "15px",
              resize: "none",
              fontSize: "16px",
            }}
          />

          <button
            onClick={handleAskAI}
            style={{
              marginTop: "15px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* AI Response */}
        <div
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.15)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
          }}
        >
          <h2>AI Response</h2>

          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
            }}
          >
            {answer || "AI answers will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}