import style from "@/styles/promptSidebar.module.css";

export default function PromptSidebarTitle({
  title,
}: {
  title: string | undefined;
}) {
  return <div className={style[`content-title`]}>{title}</div>;
}
