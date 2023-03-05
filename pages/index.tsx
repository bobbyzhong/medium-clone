import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Text, Spacer } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Text size="$2xl">The future of article sharing</Text>
            <Spacer y={1} />
            <Text size="$lg">
                ShareArticles allows you to create and share articles.
            </Text>
        </>
    );
}
