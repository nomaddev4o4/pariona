import BrandLogo from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between gap-2 p-6 shadow-xl sticky top-0 w-full z-10 bg-background/80 backdrop-blur-sm">
      <div>
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
      </div>

      <div className="flex items-center gap-10 font-semibolds">
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscriptions">Subscriptions</Link>
        <UserButton />
      </div>

      {/* <div className="flex items-center gap-2">
        <SignedIn>
          <Link href="/dashboard">Dashboard</Link>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant="outline">LogIn</Button>
          </SignInButton>

          <SignUpButton>
            <Button>SignUp</Button>
          </SignUpButton>
        </SignedOut>
      </div> */}
    </nav>
  );
}
