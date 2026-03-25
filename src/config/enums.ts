export enum LAYOUT_OPTIONS {
  HYDROGEN = "hydrogen",
  HELIUM = "helium",
  LITHIUM = "lithium",
  BERYLLIUM = "beryllium",
  BORON = "boron",
  CARBON = "carbon",
}

export const HEADER_AUTHORIZATION = "Authorization";

export enum TOKEN_TYPE {
  ACCESS = "accessToken",
  REFRESH = "refreshToken",
}

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const NOVEL_HIGHLIGHT_COLOR = {
  grey: {
    name: "grey",
    class: "bg-gray-200 text-gray-900",
  },
  green: {
    name: "green",
    class: "bg-green-200 text-green-900",
  },
  blue: {
    name: "blue",
    class: "bg-blue-200 text-blue-900",
  },
  orange: {
    name: "orange",
    class: "bg-orange-200 text-orange-900",
  },
  red: {
    name: "red",
    class: "bg-red-200 text-red-900",
  },
} as const;
