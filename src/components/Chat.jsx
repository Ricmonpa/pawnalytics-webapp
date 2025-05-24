import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ROBOFLOW_API_KEY = "VPDCKZ9xwFPaaBoBXyi2";
const ROBOFLOW_PROJECT = "pawnalytics-demo";
const ROBOFLOW_VERSION = "8";
const ROBOFLOW_URL = `https://detect.roboflow.com/${ROBOFLOW_PROJECT}/${ROBOFLOW_VERSION}?api_key=${ROBOFLOW_API_KEY}`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim() === "") return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const normalizedInput = userInput.trim().toLowerCase();

    if (normalizedInput === "sí" || normalizedInput === "si") {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "system",
            text:
              "¡Perfecto! 🐾 Vamos a comenzar el análisis de obesidad. Primero necesito una foto tomada desde arriba de tu lomito. 📸",
          },
          {
            sender: "image",
            imageUrl: "/foto-desde-arriba.png",
            caption: "Así debe verse la foto desde arriba 📷",
          },
        ]);
        setShowImageUpload(true);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "system",
            text:
              "Gracias por tu mensaje. Si quieres que analice a tu lomito, solo responde 'sí'. 🐶",
          },
        ]);
      }, 500);
    }

    setUserInput("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: "Aquí está la foto de mi lomito 🐕" },
      { sender: "image", imageUrl, caption: "Analizando..." },
    ]);
    setShowImageUpload(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("https://detect.roboflow.com/pawnalytics-demo/8?api_key=VPDCKZ9xwFPaaBoBXyi2", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const predictions = response.data?.predictions;

      if (predictions && predictions.length > 0) {
        predictions.forEach((prediction, i) => {
          const label = prediction.class;
          const confidence = (prediction.confidence * 100).toFixed(1);

          setMessages((prev) => [
            ...prev,
            {
              sender: "system",
              text: `Resultado ${i + 1}: ${label.toUpperCase()} 🧠 con ${confidence}% de certeza.`,
            },
          ]);
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text:
              "Recuerda: debes poder sentir sus costillas pero no verlas. Aquí tienes un score chart para comparar 👇",
          },
          {
            sender: "image",
            imageUrl: "/score-chart.png",
            caption: "Score chart de obesidad 🐾",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text:
              "No pude analizar correctamente la imagen 😓. Intenta con otra foto, de preferencia tomada desde arriba.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error al enviar la imagen a Roboflow:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text:
            "Ocurrió un error al analizar la imagen. Intenta más tarde o revisa tu conexión 🛠️",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialMessages = [
      { sender: "system", text: "Hola, soy Pawnalytics 🐾" },
      {
        sender: "system",
        text: "Puedo ayudarte a detectar obesidad en tu lomito.",
      },
      { sender: "system", text: "¿Quieres que te ayude? Responde sí o no. 🐶" },
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, showImageUpload]);

  return (
    <div className="chat-container" style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", margin: 0, padding: 0, boxSizing: "border-box", overflow: "hidden" }}>
      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", paddingBottom: "6rem", boxSizing: "border-box" }}>
        {messages.map((msg, index) => {
          if (msg.sender === "image") {
            return (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <img src={msg.imageUrl} alt="Imagen enviada" style={{ maxWidth: "100%", borderRadius: "0.5rem", border: "1px solid #ccc" }} />
                {msg.caption && (
                  <div style={{ marginTop: "0.5rem", background: "#EEE", padding: "0.5rem 1rem", borderRadius: "1rem", display: "inline-block" }}>{msg.caption}</div>
                )}
              </div>
            );
          }
          return (
            <div key={index} style={{ marginBottom: "0.5rem", textAlign: msg.sender === "user" ? "right" : "left" }}>
              <span style={{ background: msg.sender === "user" ? "#DCF8C6" : msg.sender === "system" ? "#E0E0E0" : "#EEE", padding: "0.5rem 1rem", borderRadius: "1rem", display: "inline-block" }}>{msg.text}</span>
            </div>
          );
        })}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span style={{ background: "#FFD700", padding: "0.5rem 1rem", borderRadius: "1rem", display: "inline-block" }}>Analizando imagen... 🧠</span>
          </div>
        )}
        {showImageUpload && (
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "inline-block", backgroundColor: "#4CAF50", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}>
              Subir foto de tu lomito 📷
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} style={{ position: "fixed", bottom: 0, left: 0, width: "100vw", display: "flex", alignItems: "center", padding: "0.5rem", background: "#f5f5f5", borderTop: "1px solid #ddd", boxSizing: "border-box" }}>
        <button type="button" onClick={() => fileInputRef.current.click()} style={{ height: "2.75rem", padding: "0 0.75rem", fontSize: "1.25rem", backgroundColor: "#eee", color: "#333", border: "1px solid #ccc", borderRadius: "0.5rem", marginRight: "0.5rem", cursor: "pointer" }}>📷</button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Escribe un mensaje..." style={{ flex: 1, height: "2.75rem", padding: "0 1rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "0.5rem", marginRight: "0.5rem" }} />
        <button type="submit" style={{ height: "2.75rem", padding: "0 1rem", fontSize: "1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
