"use client"
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "@/styles/App.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/store"; // Ensure correct path
import { Suspense } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html>
        <body>
        <Provider store={store}>
        <Header />
        <main className="py-3">
          <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
            </div>
        </main>
        <Footer />
      </Provider>
        </body>
      </html>
  );
}
