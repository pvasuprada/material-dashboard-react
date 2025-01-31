/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function NetworkGenie() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I am NetworkGenie, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        type: "bot",
        content: `I understand you're asking about "${inputMessage}". I'm currently in development, but I'll be able to help you with network-related queries soon.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium" color="text">
          NetworkGenie AI
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Your intelligent network assistant
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Chat Messages - Fixed height with scrollbar */}
      <MDBox
        sx={{
          height: "250px", // Fixed height
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 3,
          pb: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: ({ palette: { grey } }) => grey[300],
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: ({ palette: { grey } }) => grey[400],
          },
        }}
      >
        {messages.map((message, index) => (
          <MDBox
            key={index}
            sx={{
              display: "flex",
              justifyContent: message.type === "user" ? "flex-end" : "flex-start",
              gap: 1,
            }}
          >
            {message.type === "bot" && (
              <Avatar sx={{ bgcolor: "error.main", width: 32, height: 32 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
            )}
            <MDBox
              sx={{
                maxWidth: "70%",
                p: 2,
                borderRadius: 2,
                backgroundColor: message.type === "user" ? "info.main" : "background.default",
                color: message.type === "user" ? "white" : "inherit",
              }}
            >
              <MDTypography variant="body2" color={message.type === "user" ? "white" : "text"}>
                {message.content}
              </MDTypography>
              <MDTypography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: message.type === "user" ? "grey.100" : "text.secondary",
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </MDTypography>
            </MDBox>
            {message.type === "user" && (
              <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            )}
          </MDBox>
        ))}
        <div ref={messagesEndRef} />
      </MDBox>

      {/* Input Area */}
      <MDBox
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <MDBox
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask NetworkGenie..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            color="info"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            sx={{
              alignSelf: "flex-end",
              p: 1,
            }}
          >
            <SendIcon />
          </IconButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default NetworkGenie;
