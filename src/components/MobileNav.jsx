"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import sidebarLinks from "@/constants/index.js";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImCross } from "react-icons/im";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>

        <SheetContent side="left" className="border-none bg-[#101010] p-2">
          {/* ✅ Required for accessibility */}
          <DialogTitle>
            <VisuallyHidden>Mobile Navigation</VisuallyHidden>
          </DialogTitle>

          <div className="flex w-full items-center justify-between gap-4 p-4">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
              <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
              <h1 className="ml-2 text-24 font-extrabold text-white">
                Podcastr
              </h1>
            </Link>

            {/* Close Button */}
            <SheetClose asChild>
              <button aria-label="Close menu">
                <ImCross className="text-white text-lg" />
              </button>
            </SheetClose>
          </div>

          {/* Navigation Links */}
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <nav className="flex flex-col gap-6 text-white">
              {sidebarLinks.map(({ route, label, imgURL }) => {
                const isActive =
                  pathname === route || pathname.startsWith(`${route}/`);

                return (
                  <SheetClose asChild key={route}>
                    <Link
                      href={route}
                      className={cn(
                        "flex items-center gap-3 py-4 px-4 justify-start",
                        {
                          "bg-nav-focus border-r-4 border-orange-500": isActive,
                        }
                      )}
                    >
                      <Image
                        src={imgURL}
                        alt={label}
                        width={24}
                        height={24}
                      />
                      <p>{label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
