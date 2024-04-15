import { styled, Container, Box, useTheme } from "@mui/material";
import { useSelector } from "../../store/Store";
import { AppState } from "../../store/Store";
import Header from "./vertical/header/Header";
import Sidebar from "./vertical/sidebar/Sidebar";
import Customizer from "./shared/customizer/Customizer";
import Navigation from "../full/horizontal/navbar/Navigation";
import HorizontalHeader from "../full/horizontal/header/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { showNotification } from "@mantine/notifications";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

// const FullLayout: FC = ({children}) => {
const FullLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      console.log("You're not signed in");

      showNotification({
        title: "Error",
        message: "Session Expired! Redirecting you to login...",
        color: "red",
      });
      
      router.push("/auth/login");

    }

  }, [status, router]);


  return (
    <MainWrapper>
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      {customizer.isHorizontal ? "" : <Sidebar />}
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
        }}
      >
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        {customizer.isHorizontal ? <HorizontalHeader /> : <Header />}
        {/* PageContent */}
        {customizer.isHorizontal ? <Navigation /> : ""}
        <Container
          sx={{
            maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
          }}
        >
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}

          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            {/* <Outlet /> */}
            {children}
            {/* <Index /> */}
          </Box>

          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
        {/* <Customizer /> */}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
