import NavBar from "./_components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-accent h-screen">
      <NavBar />
      <div className="p-6">{children}</div>
    </div>
  );
}
