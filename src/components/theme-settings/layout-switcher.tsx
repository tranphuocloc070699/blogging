import BoronIcon from "@/components/icons/layout/boron-icon";
import HydrogenIcon from "@/components/icons/layout/hydrogen-icon";
import DrawerBlock from "@/components/theme-settings/drawer-block";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LAYOUT_OPTIONS } from "@/config/enums";
import { useLayout } from "@/hooks/use-layout";
import BerylliumIcon from '../icons/layout/beryllium-icon';
import CarbonIcon from '../icons/layout/carbon-icon';
import HeliumIcon from '../icons/layout/helium-icon';
import LithiumIcon from '../icons/layout/lithium-icon';

const layoutOptions = [
  {
    icon: HydrogenIcon,
    value: LAYOUT_OPTIONS.HYDROGEN,
  },
  {
    icon: HeliumIcon,
    value: LAYOUT_OPTIONS.HELIUM,
  },
  {
    icon: LithiumIcon,
    value: LAYOUT_OPTIONS.LITHIUM,
  },
  {
    icon: BerylliumIcon,
    value: LAYOUT_OPTIONS.BERYLLIUM,
  },
  {
    icon: BoronIcon,
    value: LAYOUT_OPTIONS.BORON,
  },
  {
    icon: CarbonIcon,
    value: LAYOUT_OPTIONS.CARBON,
  },
];

const LayoutSwitcher = () => {
  const { layout, setLayout } = useLayout()

  return (
    <DrawerBlock title="Layout">
      <RadioGroup
        value={layout}
        onValueChange={setLayout}
        className="grid grid-cols-3 gap-4"
      >

        {layoutOptions.map((item) => (
          <div
            className={"relative"} key={item.value}>
            <RadioGroupItem
              value={item.value}
              id={"theme-switcher-" + item.value}
              className="peer h-full w-full absolute inset-0 opacity-0"
            />
            <label htmlFor={"theme-switcher-" + item.value}
              className={"peer-data-[state=checked]:[&>span]:ring-2 peer-data-[state=checked]:[&>small]:text-primary"}>
              <span
                className="radio-active  inline-flex justify-center rounded-lg capitalize ring-offset-4 ring-offset-gray-0 duration-150 dark:ring-offset-gray-100">
                <item.icon
                  aria-label={item.value}
                  className="h-full w-full"
                />
              </span>{' '}
              <small className="inline-block w-full text-center capitalize">
                {item.value}
              </small>
            </label>
          </div>

        ))}
      </RadioGroup>
    </DrawerBlock>
  );
};

export default LayoutSwitcher;