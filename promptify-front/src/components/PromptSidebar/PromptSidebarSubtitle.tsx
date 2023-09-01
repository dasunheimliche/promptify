import style from "@/styles/promptSidebar.module.css";

interface PromptSidebarSubtitle {
  subtitle: string | undefined;
}

export default function PromptSidebarSubtitle({
  subtitle,
}: PromptSidebarSubtitle) {
  return (
    <div className={style[`content-subtitle-container`]}>
      <div>{subtitle}</div>
    </div>
  );
}
