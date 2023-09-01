import style from "../../styles/mainSidebar.module.css";

interface ProfileButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export default function ProfileButton({
  onClick,
  isActive,
}: ProfileButtonProps) {
  return (
    <div
      className={
        isActive
          ? `${style[`add-ai`]} ${style["selected-me"]} p`
          : `${style[`add-ai`]} p`
      }
      onClick={onClick}
    >
      ME
    </div>
  );
}
