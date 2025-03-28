import { ReactNode } from 'react';
import { Metadata } from "next";


interface LayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: 'Listings',
    description: 'Explore the latest listings on Campus Connect.',
};

export default function Layout({ children }: LayoutProps) {
    return (
        <section>
            <main>{children}</main>
        </section>
    );
}