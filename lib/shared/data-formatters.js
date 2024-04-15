import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Image } from "@mantine/core";

export const getTimeAgo = (timestamp) => {
  let timeAgo = "";

  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNowStrict(date);
    timeAgo = `${timePeriod} ago`;
  }

  return timeAgo;
};

  // Function to determine the file type
  export const fileType = (url) => {
    if (!url) return null;

    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <Image alt="" src={`/images/pdf.png`} radius="sm" mt="xs" height={100} width={100} />;
      case 'doc':
      case 'docx':
        return <Image alt="" src={`/images/word.png`} radius="sm" mt="xs" height={100} width={100} />;
      default:
        // For image files
        return <Image alt="" src={url} radius="sm" mt="xs" height={100} width={100} />;
    }
  };

  export const formatDateTime = (date) => {
    if (!date) return '';

    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = (`0${dateTime.getMonth() + 1}`).slice(-2); // Adding 1 because months are 0 indexed
    const day = (`0${dateTime.getDate()}`).slice(-2);
    const hours = (`0${dateTime.getHours()}`).slice(-2);
    const minutes = (`0${dateTime.getMinutes()}`).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  export const formatDateOnly = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2); // months are 0-indexed
    const day = (`0${d.getDate()}`).slice(-2);

    return `${year}-${month}-${day}`;
  };

export const parseValidInt = (value) => (parseInt(value) ? parseInt(value) : 0);

export const parseValidFloat = (value) =>
  parseFloat(value) ? parseFloat(value) : 0;

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(parseValidFloat(number).toFixed(2));
};

export const formatDate = (date) => {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Date(date).toLocaleString("en-GB", options);
};

export const formatDateNoTime = (date) => {
  const options = {
    dateStyle: "medium",
  };
  return new Date(date).toLocaleString("en-GB", options);
};

export const getDateFilterFrom = (x_days) => {
  if (!x_days) {
    x_days = process?.env?.NEXT_PUBLIC_DAYS_AGO_FILTER ?? 1;
    x_days = parseValidInt(x_days);
  }

  const today = new Date();
  today.setDate(today.getDate() - x_days);
  return today.toISOString().split("T")[0];
};

export const deductDaysFromToday = (x_days) => {
  const today = new Date();
  today.setDate(today.getDate() - x_days);
  return today.toISOString().split("T")[0];
};

export const getDateFilterTo = (x_days) => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
