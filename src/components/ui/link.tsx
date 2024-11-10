import { ReactNode } from "react";
import { buttonVariants } from "./style";
import { concat_string} from "@/utils";
import { scrollToId} from "@/dom";
import { Link as RouterLink } from "react-router-dom";
import { Link as LinkType} from "@/types";

interface LinkProps {
  className?: string;
  href: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
}

interface ScrollableLinkProps {
    to: string;
    children?: ReactNode;
    className?: string;
    offset?: number
}

interface ButtonLinkProps {
  className?: string;
  href: string;
  target?: string;
  children?: ReactNode;
}


interface DynamicLinkProps {
  link: LinkType;
}

const Link = ({ className, href, children, target, rel }: LinkProps) => {
    return (
        <a className={className} href={href} target={target} rel={rel}>
            {children}
        </a>
    );
};

/**
 * ScrollableLink Component
 *
 * A scrollable link component that serves as an alternative to a traditional <Link> component.
 * It handles in-page hash scrolling with smooth scroll behavior, resolving issues with
 * React Router's HashRouter and BrowserRouter in navigating and scrolling to anchors.
 */
const ScrollableLink = ({ to, offset, children, className}: ScrollableLinkProps) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (!to.startsWith("#")) {
            throw new Error("ScrollableLink supports current page sections only");
        }

        const hash = to.slice(1);
        scrollToId(hash, offset !== undefined ? offset : 0);
    };   
    return (
        <a
            href={to}
            onClick={handleClick}
            className={className}
        >
            {children}
        </a>
    );
};



const ButtonLink = ({ href, target, children, className }: ButtonLinkProps) => {
    return (
        <Link
            href={href}
            target={target}
            className={
                className
                    ? concat_string(
                        buttonVariants({ variant: "outline" }),
                        className,
                        " ",
                    )
                    : buttonVariants({ variant: "outline" })
            }
        >
            {children}
        </Link>
    );
};

const DynamicLink = ({ link }: DynamicLinkProps) => {
    if (link.href.startsWith("#")) {
        return (
            <ScrollableLink
                to={link.href}
                className="text-sm font-medium hover:underline underline-offset-42"
            >
                {link.name}
            </ScrollableLink>
        );
    }
    if (link.href.startsWith("http")) {
        return (
            <a
                href={link.href}
                className="text-sm font-medium hover:underline underline-offset-42"
                target={link.newTab ? "_blank" : undefined}
                rel={link.newTab ? "noopener noreferrer" : undefined}
            >
                {link.name}
            </a>
        );
    }
    return (
        <RouterLink
            to={link.href}
            className="text-sm font-medium hover:underline underline-offset-42"
        >
            {link.name}
        </RouterLink>
    );
};


export { Link, ButtonLink, ScrollableLink, DynamicLink, RouterLink };
