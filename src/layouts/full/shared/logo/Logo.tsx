import { FC } from "react";
import { useSelector } from "../../../../store/Store";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "../../../../store/Store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    // height: "70px",
    width: customizer.isCollapse ? "40px" : "200px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/logo.png"
            alt="logo"
            height={70}
            width={150}
            priority
          />
        ) : (
          <Image
            src={"/images/logos/logo.png"}
            alt="logo"
            height={70}
            width={150}
            priority
          />
        )}
        
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/logo.png"
          alt="logo"
          height={70}
          width={200}
          priority
        />
      ) : (
        <Image
          src="/images/logos/logo.png"
          alt="logo"
          height={70}
          width={200}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
