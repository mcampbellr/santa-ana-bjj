import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Timer } from "@/components/Timer";
import Fighter from "@/components/Fighter";

export default function Home() {
  return (
    <>
      <Head>
        <title>Santa Ana BJJ score app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <header className={styles.header}>
            <div>
              <Image
                src="/logo.svg"
                alt="Santa Ana BJJ Logo"
                width={200}
                height={200}
                className={styles.logo}
              />
            </div>
            <Timer />
          </header>
          <section className={styles.fighters}>
            <Fighter fighterId={1} />
            <Fighter fighterId={2} />
          </section>
        </main>
      </div>
    </>
  );
}
