"use client"
import "@/styles/App.css";
import './globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      {isHomePage && <HeroCarousel />}
      <main className="flex justify-center">
        <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>LeafyLane - Premium Plants & Gardening</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="description" content="LeafyLane - Your premium destination for plants and gardening essentials" />
      </head>
      <body>
        <Provider store={store}>
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </body>
    </html>
  );
}
