import React from "react";
import Avatar from "@mui/material/Avatar";
import { Skeleton, SxProps, Theme } from "@mui/material";

interface IUserAvatar {
  photoURL: string;
  userName: string;
  style?: SxProps<Theme>
}

function getContrastTextColor(hexColor:string) {
  const r: number = parseInt(hexColor.substring(1, 3), 16);
  const g: number = parseInt(hexColor.substring(3, 5), 16);
  const b: number = parseInt(hexColor.substring(5, 7), 16);

  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness < 125 ? "#ffffff" : "#000000";
}

function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stylesFromString(name: string) {
  const nameParts = name.split(' ');
  let nameFirstLetters = ''
  nameParts.forEach(parts => nameFirstLetters +=parts[0].toUpperCase())

  return {
      bgcolor: stringToColor(name),
      color: getContrastTextColor(stringToColor(name)),
    }
}
const getFirstNamesLetters = (name: string) => {
  const nameParts = name.split(" ");
  let nameFirstLetters = "";
  nameParts.forEach((parts) => (nameFirstLetters += parts[0].toUpperCase()));
  return nameFirstLetters
}

function UserAvatar({ photoURL, userName, style = {} }: IUserAvatar) {
  if (!photoURL && !userName) {
    return <Skeleton variant="rounded" sx={{...style}} />
  }
  else if (photoURL) {
    return <Avatar sx={{ ...style }} src={photoURL} />;
  } else {
    return (
      <Avatar
        sx={{
          ...stylesFromString(userName),
          ...style,
        }}
      >
        {getFirstNamesLetters(userName)}
      </Avatar>
    );
  }
}

export { UserAvatar }
