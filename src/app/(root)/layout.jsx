import Leftbar from "@/components/Leftbar";
import MobileNav from "@/components/MobileNav";
import PodcastPlayer from "@/components/PodcastPlayer";
import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex">
        <Leftbar/>
        <section className="flex min-h-screen flex-1 flex-col px-4 md:px-7">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon"/>
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              {children}
            </div>
          </div>
        </section>
      </main>
      <PodcastPlayer/>  
    </div>
  );
}