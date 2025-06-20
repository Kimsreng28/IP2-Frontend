import { Menu } from "@/src/types/menu";

const menuProfileData: Menu[] = [
  {
    id: 1,
    title: "Account Details",
    newTab: false,
    path: "/client/pages/profile/account",
  },
  {
    id: 2,
    title: "Address",
    newTab: false,
    path: "/client/pages/profile/address",
  },
  {
    id: 3,
    title: "Orders",
    newTab: false,
    path: "/client/pages/profile/orders",
  },
  {
    id: 4,
    title: "Wishlist",
    newTab: false,
    path: "/client/pages/profile/wishlist",
  },
  {
    id: 5,
    title: "Wallet",
    newTab: false,
    path: "/client/pages/profile/wallet",
  },
  {
    id: 6,
    title: "Log Out",
    newTab: false,
    path: "/client/pages/profile/logout",
  },
];

export default menuProfileData;
