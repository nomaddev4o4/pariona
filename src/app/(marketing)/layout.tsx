import Navbar from "./_components/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="selection:bg-pink-500/50">
      <Navbar />
      {children}
    </div>
  );
}
