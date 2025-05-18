import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-2 p-6 shadow-xl sticky top-0 w-full z-10 bg-background/80 backdrop-blur-sm">
      <div>
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
      </div>

      <div className="flex items-center gap-4 font-semibolds">
        <Link href="/">Features</Link>
        <Link href="#pricing">Pricing</Link>
        <Link href="/">About</Link>
      </div>

      <div className="flex items-center gap-2">
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
      </div>
    </nav>
  );
}
