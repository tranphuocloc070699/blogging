import DrawerBlock from "@/components/theme-settings/drawer-block";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDirection } from "@/hooks/use-direction";
import { AlignLeft, AlignRight } from "lucide-react";

const directionOptions = ['ltr', 'rtl'];

const AppDirection = () => {
  const { direction, setDirection } = useDirection();
  return (
    <DrawerBlock title="Direction">
      <RadioGroup
        value={direction ?? "ltr"}
        onValueChange={setDirection}
        className="grid grid-cols-2 gap-4"
      >

        {directionOptions.map((item) => (
          <div
            className={"relative"} key={item}>
            <RadioGroupItem
              value={item}
              id={"theme-switcher-" + item}
              className="peer h-full w-full absolute inset-0 opacity-0"
            />
            <label htmlFor={"theme-switcher-" + item}
              className={"peer-data-[state=checked]:[&>span]:ring-2 peer-data-[state=checked]:[&>small]:text-primary"}>
              <span
                className="min-w-[90px] flex items-center justify-center min-h-14 bg-muted dark:bg-gray-500/20 cursor-pointer mb-3 rounded-lg ring-primary ring-offset-4 ring-offset-background dark:ring-offset-gray-100 ">
                {item === 'ltr' ? (
                  <AlignLeft
                    className="me-2 h-auto w-6 text-gray-400 dark:text-muted-foreground" />
                ) : null}
                <small className={"uppercase"}>{item}</small>
                {item === 'rtl' ? (
                  <AlignRight
                    className="ms-2 h-auto w-6 text-gray-400 dark:text-muted-foreground" />
                ) : null}
              </span>
            </label>
          </div>

        ))}
      </RadioGroup>
    </DrawerBlock>
  );
};

export default AppDirection;