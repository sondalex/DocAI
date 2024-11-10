import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Heart } from "lucide-react";
import { ReactNode } from "react";

type CardType = { logo: ReactNode; title: string; caption: string };

interface LandingPageProps {
  title: string;
  caption: string;
  cards: CardType[];
}
import { Link as RouterLink } from "react-router-dom";
import { ButtonLink, Link } from "@/components/ui/link";
import { Header } from "@/components/ui/header";
import { VideoSource, Video } from "@/components/ui/video";

const RouteLink = ({
    href,
    ...props
}: {
  href: string;
} & Omit<React.ComponentProps<typeof RouterLink>, "to">) => (
    <RouterLink to={href} {...props} />
);

const LandingPage = ({ title, caption, cards }: LandingPageProps) => {
    const videoSources: VideoSource[] = [
        {
            src: "/demo-lowres-lossless.webm",
            type: "video/webm",
            media: "screen and (max-width:767px)",
        },
        {
            src: "/demo-midres-lossless.webm",
            type: "video/webm",
            media: "screen and (min-width:768px) and (max-width:1023px)",
        },
        {
            src: "/demo-highres-lossless.webm",
            type: "video/webm",
            media: "screen and (min-width:1024px)",
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header
                title="DocAI"
                links={[
                    { href: "#features", newTab: false, name: "Features" },
                    {
                        href: "https://github.com/sondalex/DocAI",
                        newTab: true,
                        name: "GitHub",
                    },
                ]}
            />

            <main className="flex-1">
                <section className="w-full md:pt-12 pt-8 md:h-screen max-h-screen">
                    <div className="container  mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    {title}
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    {caption}
                                </p>
                            </div>
                            <div className="w-full mx-auto max-w-3xl container md:py-12 py-8">
                                <div className="relative md:w-[720px] w-80 mx-auto aspect-video bg-white rounded-lg overflow-hidden">
                                    <Video
                                        sources={videoSources}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="custom-video-class"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    {
                                        // image label
                                    }
                                </p>
                            </div>

                            <div id="features" className="space-x-4 flex flex-row py-8">
                                <Button>
                                    <RouteLink href="/app" className="min-w-8">
                    Get Started
                                    </RouteLink>
                                </Button>
                                <ButtonLink
                                    href="https://github.com/sondalex/DocAI"
                                    target="_blank"
                                    className="bg-slate-900"
                                >
                                    <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container mx-auto">
                        <div className="flex md:flex-row flex-col px-8 gap-8 justify-center items-center mx-auto">
                            {cards.map((item: CardType) => (
                                <Card
                                    key={item.title}
                                    className="flex flex-col p-8 text-center justify-center space-y-4 aspect-square md:w-96 w-72 transition-shadow hover:shadow-md"
                                >
                                    <div className="mx-auto">{item.logo}</div>
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-center text-gray-500 dark:text-gray-400">
                                        {item.caption}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Open Source and Free
                                </h2>
                                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  DocAI is open-source and free to use. Contribute to the
                  project, customize it for your needs, or simply use it as is.
                                </p>
                            </div>
                            <div className="space-x-4 py-8">
                                <Button>
                                    <RouteLink href="/app">Start Processing Documents</RouteLink>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex h-14 items-center border-t px-4 lg:px-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 DocAI
                </p>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <div className="lg:text-left text-center  w-56 text-sm">
                        <p className="whitespace-nowrap flex items-center justify-center lg:justify-start">
              Made with <Heart className="inline-block w-4 h-4 mx-1" /> by{" "}
                            <Link
                                href="https://github.com/sondalex"
                                className="ml-1"
                                target="_blank"
                            >
                                <span className="font-bold hover:underline">sondalex</span>
                            </Link>
                        </p>
                    </div>
                </nav>
            </footer>
        </div>
    );
};

export default LandingPage;
