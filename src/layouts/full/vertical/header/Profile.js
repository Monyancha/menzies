import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import * as dropdownData from './data';
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { showNotification } from '@mantine/notifications';
import { useSession } from 'next-auth/react';
import { IconUser } from '@tabler/icons-react';


const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const { data: session, status } = useSession();

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
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/profile/user-1.jpg"}
          alt={'ProfileImg'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
        <Avatar src={"/images/profile/user-1.jpg"} alt={"ProfileImg"} sx={{ width: 50, height: 50 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {session?.user?.name ?? '-'}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconUser width={15} height={15} />
              {session?.user?.role_id === 1 && "Manager"}
              {session?.user?.role_id === 2 && "Security Head"}
              {session?.user?.role_id === 3 && "Security"}
              {session?.user?.role_id === 4 && "Agent"}
            </Typography>
            
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {session?.user?.email ?? ''}
            </Typography>
          </Box>
        </Stack>
        <Divider />

        <Box mt={2}>
          <Button onClick={() => signUserOut()} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
