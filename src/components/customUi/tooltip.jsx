import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ToolTipCustom = (props) => {
  return (
    <TooltipProvider skipDelayDuration={300}>
  <Tooltip  delayDuration={300}>
    <TooltipTrigger asChild>
        {props.trigger}
    </TooltipTrigger>
    <TooltipContent side={props.side || "top"} sideOffset={0} avoidCollisions={true} collisionPadding={16} className="text-sm">
      <div>{props.message}</div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
  )
}

export default ToolTipCustom