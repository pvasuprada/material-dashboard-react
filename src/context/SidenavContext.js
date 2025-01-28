import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useMaterialUIController, setMiniSidenav } from "context";

const SidenavContext = createContext();

export function SidenavProvider({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const [showSidenav, setShowSidenav] = useState(true);
  const [sidenavContent, setSidenavContent] = useState("dashboards");
  const [activeButton, setActiveButton] = useState("dashboards");

  const toggleSidenav = (content) => {
    if (content && content !== sidenavContent) {
      // If clicking a different section, always show full sidenav and update content
      setShowSidenav(true);
      setMiniSidenav(dispatch, false); // Ensure full sidenav
      setSidenavContent(content);
      setActiveButton(content);
    } else {
      // If clicking same section or toggle button, toggle visibility
      setShowSidenav((prev) => !prev);
    }
  };

  const openSidenav = (content) => {
    // Always open full sidenav
    setShowSidenav(true);
    setMiniSidenav(dispatch, false); // Ensure full sidenav when opening
    if (content) {
      setSidenavContent(content);
      setActiveButton(content);
    }
  };

  return (
    <SidenavContext.Provider
      value={{
        showSidenav,
        sidenavContent,
        activeButton,
        toggleSidenav,
        openSidenav,
      }}
    >
      {children}
    </SidenavContext.Provider>
  );
}

SidenavProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSidenav() {
  const context = useContext(SidenavContext);
  if (context === undefined) {
    throw new Error("useSidenav must be used within a SidenavProvider");
  }
  return context;
}
