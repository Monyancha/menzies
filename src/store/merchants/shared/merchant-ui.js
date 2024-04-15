// eslint-disable-next-line react-hooks/exhaustive-deps
import { debounce } from "lodash";
import { createContext, useEffect, useState } from "react";
import getLogger from "../../../../lib/shared/logger";

const MerchantUiContext = createContext({
  loaders: {
    count: 0,
    actions: {
      increment: () => {},
      decrement: () => {},
    },
  },
  sidenav: {
    collapsed: false,
    actions: {
      toggle: () => {},
      collapse: () => {},
      expand: () => {},
    },
  },
  layout: {
    windowWidth: 0,
    showSideNav: false,
  },
  pos: {
    visibleTab: "item_cards",
    actions: {
      showOrderDetails: () => {},
      showItemCards: () => {},
      areOrderDetailsVisible: () => {},
      areItemCardsVisible: () => {},
    },
  },
});

export function MerchantUiContextProvider(props) {
  const logger = getLogger("MerchantUiContext");
  const [sidenavCollapsed, setSidenavCollaped] = useState(false);
  const [loaders, setLoaders] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showSideNav, setShowSideNav] = useState(false);
  const [visiblePosTab, setVisiblePosTab] = useState("item_cards");

  useEffect(() => {
    if (loaders < 0) {
      setLoaders(0);
    }
  }, [loaders]);

  function toggleSidenavCollaped() {
    logger.log("Toggling sidenav", sidenavCollapsed);
    setSidenavCollaped(!sidenavCollapsed);
  }

  function collapseSidenav() {
    setSidenavCollaped(true);
  }

  function expandSidenav() {
    setSidenavCollaped(false);
  }

  function incrementLoaders() {
    setLoaders(loaders + 1);
  }

  function decrementLoaders() {
    setLoaders(loaders - 1);
  }

  function toggleSidenav() {
    setShowSideNav(!showSideNav);
  }

  function onResizeWindow() {
    if (typeof window !== undefined) {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setShowSideNav(true);
      } else {
        setShowSideNav(false);
      }
    } else {
      setWindowWidth(0);
      logger.log("onResizeWindow", 0);
    }
  }

  useEffect(() => {
    onResizeWindow();

    window.addEventListener(
      "resize",
      debounce(() => onResizeWindow(), 750)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = {
    loaders: {
      count: loaders,
      actions: {
        increment: incrementLoaders,
        decrement: decrementLoaders,
      },
    },
    sidenav: {
      collapsed: sidenavCollapsed,
      actions: {
        toggle: toggleSidenavCollaped,
        collapse: collapseSidenav,
        expand: expandSidenav,
      },
    },
    layout: {
      windowWidth,
      showSideNav,
      actions: {
        toggleSidenav,
        isMobile: () => windowWidth <= 1024,
        isMobileDefault: () => windowWidth < 1000,
      },
    },
    pos: {
      visibleTab: visiblePosTab,
      actions: {
        showOrderDetails: () => setVisiblePosTab("order_details"),
        showItemCards: () => setVisiblePosTab("item_cards"),
        areOrderDetailsVisible: () => visiblePosTab === "order_details",
        areItemCardsVisible: () => visiblePosTab === "item_cards",
      },
    },
  };

  return (
    <MerchantUiContext.Provider
      value={context}
      displayName="Merchant UI Context"
    >
      {props.children}
    </MerchantUiContext.Provider>
  );
}

export default MerchantUiContext;
