import { Card, AI, Topic, Visibility } from "@/types";

export const getUserToken = (): string | null => {
  let tkn: string | null = null;
  if (typeof window !== "undefined") {
    tkn = sessionStorage.getItem("user-token");
  }
  return tkn;
};

export const doNothing = (e: any) => {
  e.preventDefault();
};

export const closePopUp = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  setVisibility: React.Dispatch<React.SetStateAction<Visibility>>
) => {
  e.preventDefault();
  setVisibility((prev) => ({ ...prev, showMenu: "none" }));
};

export const theresFavs = (itemList: Card[] | AI[] | Topic[] | undefined) => {
  return itemList?.some((item) => item.fav);
};
