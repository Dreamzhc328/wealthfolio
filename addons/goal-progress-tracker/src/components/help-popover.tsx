import { Button, Icons, Popover, PopoverContent, PopoverTrigger } from "@wealthfolio/ui";

// Help popover component using shadcn Popover
function HelpPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="帮助">
          <Icons.HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">使用说明</h4>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>• 从已保存的目标中选择，或自定义追踪一个目标金额</p>
              <p>• 每个圆点代表朝投资目标推进的一个步进金额</p>
              <p>• 绿色圆点表示根据当前持仓价值已完成的里程碑</p>
              <p>• 部分填充的圆点显示当前里程碑内的进度</p>
              <p>• 点击任意圆点可查看该里程碑对应的目标金额</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { HelpPopover };
