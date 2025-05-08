import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PropsType = {
  children2: React.ReactNode;
  children: React.ReactNode;
};

function Tooltipmanager({ children2, children }: PropsType) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{children2}</TooltipContent>
    </Tooltip>
  );
}

export default Tooltipmanager;
