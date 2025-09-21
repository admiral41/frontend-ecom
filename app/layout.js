import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import NavTop from "@/components/NavTop";


const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "The Computer Lab",
  description: "Electronics Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`} >
        <Toaster />
        <AppContextProvider>
          <header className='sticky top-0 z-50 w-full'>
            <NavTop/>
            <Navbar />
          </header>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
