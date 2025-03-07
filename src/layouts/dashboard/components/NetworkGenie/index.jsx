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
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { keyframes } from "@mui/system";
import { api } from "services/api";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Define the typing animation keyframes
const typingAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

function NetworkGenie() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I am NetworkGenie, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   if (!isInitialLoad) {
  //     scrollToBottom();
  //   } else {
  //     setIsInitialLoad(false);
  //   }
  // }, [messages, isInitialLoad]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

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
    setIsLoading(true);

    try {
      // Send message to API and get response
      const response = await api.sendChatMessage(inputMessage);
      
      const botMessage = {
        type: "bot",
        content: response.message || response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card 
      sx={{ 
        height: isFullScreen ? "100vh" : "100%",
        width: isFullScreen ? "100vw" : "100%",
        position: isFullScreen ? "fixed" : "relative",
        top: isFullScreen ? 0 : "auto",
        left: isFullScreen ? 0 : "auto",
        zIndex: isFullScreen ? 1300 : "auto",
        m: isFullScreen ? 0 : "auto",
        borderRadius: isFullScreen ? 0 : 1,
      }}
    >
      <MDBox pt={3} px={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium" color="text">
            NetworkGenie AI
          </MDTypography>
          <MDBox mt={0} mb={2}>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Your intelligent network assistant
            </MDTypography>
          </MDBox>
        </MDBox>
        <IconButton onClick={toggleFullScreen} color="info">
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </MDBox>

      {/* Chat Messages - Fixed height with scrollbar */}
      <MDBox
        sx={{
          height: isFullScreen ? "calc(100vh - 180px)" : "250px",
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
        {isLoading && (
          <MDBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <Avatar sx={{ bgcolor: "error.main", width: 32, height: 32 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <MDBox
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <MDBox
                    key={i}
                    sx={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "info.main",
                      borderRadius: "50%",
                      animation: `${typingAnimation} 1s infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </MDBox>
            </MDBox>
          </MDBox>
        )}
        <div ref={messagesEndRef} />
      </MDBox>

      {/* Input Area */}
      <MDBox
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "grey.200",
          position: isFullScreen ? "fixed" : "relative",
          bottom: isFullScreen ? 0 : "auto",
          left: isFullScreen ? 0 : "auto",
          right: isFullScreen ? 0 : "auto",
          backgroundColor: "white",
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
