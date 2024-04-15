import React from "react";
import { useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import { useSession } from "next-auth/react";

import { useRouter } from "next/router";

export default function Modern() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated") {
      console.log("Authenticated successfully");
      let next_url = "/dashboard";
      
      console.log("Going to this URL: ", next_url);
      router.replace(next_url);
      return;
    } else {
      router.push("/auth/login");
    }

  }, [status, router]);

  return (
    <>
    </>
  );
};

