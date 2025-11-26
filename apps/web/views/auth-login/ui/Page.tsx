import { signIn } from "@app/auth"
import { Button } from "@repo/ui/button"

export default function LoginPage() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form
                action={async () => {
                    "use server"
                    await signIn("authentik", { redirectTo: "/" })
                }}
            >
                <Button appName="web" className="secondary">
                    Sign in with Authentik
                </Button>
            </form>
        </div>
    )
}
