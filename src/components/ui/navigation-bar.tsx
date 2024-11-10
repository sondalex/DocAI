import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "./style";
import { Link } from "./link";

interface NavigationItem {
  href: string;
  text: string;
}
interface NavigationItems {
  items: NavigationItem[];
}

const NavigationBar = ({ items }: NavigationItems) => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    {items.map((item) => (
                        <Link href={item.href}>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                {item.text}
                            </NavigationMenuLink>
                        </Link>
                    ))}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export { NavigationBar };
