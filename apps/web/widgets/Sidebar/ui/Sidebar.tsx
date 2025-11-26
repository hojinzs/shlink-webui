import Link from "next/link";
import { signOut } from "@app/auth";
import { Button } from "@shared/components/button";
import { Separator } from "@shared/components/separator";
import {
    LayoutDashboard,
    Link as LinkIcon,
    PlusCircle,
    Tags,
    LogOut
} from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-64 bg-card border-r h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight">Shlink WebUI</h1>
            </div>
            <Separator />
            <nav className="flex-1 p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/urls">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Short URLs
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/urls/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create URL
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/tags">
                        <Tags className="mr-2 h-4 w-4" />
                        Tags
                    </Link>
                </Button>
            </nav>
            <Separator />
            <div className="p-4">
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/login" });
                    }}
                >
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    );
}
