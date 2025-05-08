import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineBank,
  AiOutlineDollar,
  AiOutlineTransaction,
  AiOutlineMoneyCollect,
  AiOutlineFileText,
} from "react-icons/ai";

export const menuItems = [
  {
    title: "Dashboard",
    icon: AiOutlineHome,
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: AiOutlineUser,
    path: "/clients",
  },
  {
    title: "Transactions",
    icon: AiOutlineTransaction,
    path: "/transactions",
  },
  {
    title: "Withdraws",
    icon: AiOutlineMoneyCollect,
    path: "/withdraw",
  },
  {
    title: "Banking",
    icon: AiOutlineBank,
    submenu: [
      {
        title: "Banks",
        path: "/banks",
      },

      {
        title: "Accounts",
        path: "/bank-accounts",
      },
    ],
  },
  {
    title: "Currency",
    icon: AiOutlineDollar,
    submenu: [
      {
        title: "Currencies",
        path: "/currencies",
      },
      {
        title: "Networks",
        path: "/networks",
      },
    ],
  },

  {
    title: "User Management",
    icon: AiOutlineUser,
    submenu: [
      {
        title: "All Users",
        path: "/users",
      },

      {
        title: "Active Users",
        path: "/users/active",
      },
      {
        title: "Pending Users",
        path: "/users/pending",
      },
      {
        title: "FROZEN Users",
        path: "/users/FROZEN",
      },

      {
        title: "Suspended Users",
        path: "/users/suspended",
      },
    ],
  },

  {
    title: "Settings",
    icon: AiOutlineSetting,
    submenu: [
      {
        title: "Fees",
        path: "/transaction-fees",
      },
      {
        title: "Countries",
        path: "/countries",
      },
      {
        title: "Contents",
        path: "/contents",
      },
    ],
  },
];
