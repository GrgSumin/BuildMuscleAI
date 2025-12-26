import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AppLayout({
  //layout basically hepls in styling and state mangement
  //this one is the local one so we will do local level stylingand state mangement here
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      {children}
    </div>
  );
}
