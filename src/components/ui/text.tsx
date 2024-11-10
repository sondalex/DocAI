import { ScrollArea } from "@/components/ui/scroll-area";
import { where,  sliceOutOfIndices } from "@/utils";
import { Text, File } from "@/types";
import { Check } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { useState } from "react";

interface PaginationBarProps {
  values: string[];
  active: number;
  className: string;
  onClick: (index: number) => void;
}

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";

interface ModelClick {
  alias: string;
  on: boolean;
}

interface MenuBarProps {
  className: string;
  onFileImport: ({ name, content }: File) => void;
  onModelClick: ({ alias, on }: ModelClick) => void;
  menuItems: string[];
  exclusive: boolean; // mutually exclusive
}

const MenuBar = ({
    className,
    onFileImport,
    onModelClick,
    menuItems,
    exclusive,
}: MenuBarProps) => {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const toggleItem = (item: string) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (exclusive) {
                newSelected.clear();
            }
            if (newSelected.has(item)) {
                newSelected.delete(item);
            } else {
                newSelected.add(item);
            }
            return newSelected;
        });
        onModelClick({ alias: item, on: !selectedItems.has(item) });
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleOnImport = (_: React.MouseEvent<HTMLDivElement>) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (fileLoadEvent) => {
                    const content = fileLoadEvent.target?.result as string;
                    onFileImport({ name: file.name, content: content });
                };
                reader.readAsText(file);
            }
        };
        onFileImport({ name: "", content: "" });

        input.click();
    };

    return (
        <Menubar className={className}>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={handleOnImport}>Import</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Models</MenubarTrigger>
                <MenubarContent>
                    {menuItems.map((item) => (
                        <MenubarItem onClick={() => toggleItem(item)}>
                            <div className="flex flex-row w-full justify-between">
                                {item}
                                {selectedItems.has(item) && <Check className="w-4 h-4 ml-2" />}
                            </div>
                        </MenubarItem>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

const PaginationBar = ({
    values,
    active,
    className,
    onClick,
}: PaginationBarProps) => {
    return (
        <Pagination className={className}>
            <PaginationContent>
                {values.map((value, index) => (
                    <PaginationItem
                        onClick={() => {
                            onClick(index);
                        }}
                        className="w-auto"
                    >
                        <PaginationLink className="w-auto" isActive={active == index}>
                            {value}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
};

interface TextViewerProps {
  texts: Text[] | undefined;
  className: string;
}

const TextViewer = ({ texts, className }: TextViewerProps) => {
    const defaultClassName = "h-[400px] w-full rounded-md border p-4";
    if (!texts) {
        return <ScrollArea className={className} />;
    }
    const idxs = where(
        texts.map((item) => item.text),
        "\n\n",
    );

    const slices = sliceOutOfIndices(texts, idxs);
    return (
        <ScrollArea className={className ? className : defaultClassName}>
            <div className="text-sm text-justify">
                {[...slices].map((slice, sliceIndex) => (
                    <p key={sliceIndex} className="leading-7 [&:not(:first-child)]:mt-6">
                        {[...slice].map((item, itemIndex) => (
                            <span
                                key={itemIndex}
                                style={{
                                    backgroundColor: item.color,
                                    opacity: item.opacity,
                                }}
                                className="mr-1"
                            >
                                {item.text}
                            </span>
                        ))}
                    </p>
                ))}
            </div>
        </ScrollArea>
    );
};

export { TextViewer, PaginationBar, MenuBar };
export type { Text, ModelClick };
