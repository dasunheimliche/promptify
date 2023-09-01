import style from "../../styles/mainSidebar.module.css";

interface AddAiButtonProps {
  onClick: () => void;
}

export default function AddAiButton({ onClick }: AddAiButtonProps) {
  return (
    <div className={`${style[`add-ai`]} p`} onClick={onClick}>
      +
    </div>
  );
}
