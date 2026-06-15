import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await API.post("/login", null, {
        params: {
          email,
          password,
        },
      });

      setMessage(response.data.message);

      if (response.data.message === "Login Successful") {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        navigate("/student");
      }
    } catch (error) {
      console.error(error);
      setMessage("Login Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(15px)",
          color: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          CampusGuide AI
        </h1>

        <p style={{ textAlign: "center" }}>
          AI Powered University Assistant
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={buttonStyle}
        >
          Login
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "none",
};

const buttonStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: "#ffffff",
  color: "#4F46E5",
  fontWeight: "bold",
};