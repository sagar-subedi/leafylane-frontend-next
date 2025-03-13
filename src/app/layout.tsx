"use client";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/App.css";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/store"; // Ensure correct path
import { Suspense } from 'react';
// import store from "@/store/store";

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
