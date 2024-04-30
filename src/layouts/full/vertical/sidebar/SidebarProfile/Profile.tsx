import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from '../../../../../store/Store';
import { IconPower } from '@tabler/icons-react';
import { AppState } from '../../../../../store/Store';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import { showNotification } from '@mantine/notifications';
import { IconUser } from '@tabler/icons-react';


export const Profile = () => {
  const { data: session, status } = useSession();
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  //
  function signUserOut() {
    signOutHelper();
  }

  console.log("Session Monyancha", session);

  function signOutHelper() {
      let callbackUrl = "/";

      signOut({ callbackUrl });

      //Show Notification
      showNotification({
        title: "Success",
        message: "Logout success, redirecting you to login...",
        color: "green",
    });
  }

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ ml: 3, mr: 3, mt: 2, p: 1, bgcolor: `${'primary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Image" src={"/images/profile/user-1.jpg"} sx={{height: 40, width: 40}} />

          <Box>
            <Typography variant="h6" color="#ffffff">{session?.user?.name ?? '-'}</Typography>
            <Typography variant="caption" color="#ffffff">{session?.user?.role_id === 1 && "Manager"}</Typography>
            <Typography variant="caption" color="#ffffff">{session?.user?.role_id === 2 && "Security Head"}</Typography>
            <Typography variant="caption" color="#ffffff">{session?.user?.role_id === 3 && "Security"}</Typography>
            <Typography variant="caption" color="#ffffff">{session?.user?.role_id === 4 && "Agent"}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                aria-label="logout"
                size="small"
                onClick={() => signUserOut()}
              >
                <IconPower color="#ffffff" size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
