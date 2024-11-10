import { FileText } from "lucide-react";
import {Link} from "@/types"

interface HeaderProps {
  title: string;
  links: Link[];
}

interface HeaderProps {
  title: string;
  links: Link[];
}

import {DynamicLink, RouterLink} from "./link"

const Header = ({ title, links }: HeaderProps) => {
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <RouterLink className="flex items-center justify-center" to="/">
                <FileText className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{title}</span>
            </RouterLink>
            {links.length > 0 && (
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    {links.map((link: Link) => (
                        <DynamicLink key={link.href} link={link} />
                    ))}
                </nav>
            )}
        </header>
    );
};


export { Header };
