import { User } from "@/types";

import style from "@/styles/secondSidebar.module.css";

interface ProfileCardProps {
  user: User | undefined;
  onSignOff: () => void;
}

export default function Profile({ user, onSignOff }: ProfileCardProps) {
  return (
    <div className={style["profile-card"]}>
      <div className={style["profile-name"]}>{user?.name}</div>
      <button
        className={style["sign-off"]}
        onClick={onSignOff}
        type="button"
        title="Sign off"
      >
        Sign Off
      </button>
    </div>
  );
}
