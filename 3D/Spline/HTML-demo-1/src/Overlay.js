import styles from "./Overlay.module.css";

export function Overlay({ scroll }) {
  return (
    <div
      className={styles.scrollContainer}
      onScroll={(e) => {
        const scroll01 =
          e.target.scrollTop / (e.target.scrollHeight - window.innerHeight);
        scroll.current = scroll01;
      }}
    >
      <section
        style={{ height: "100vh" }}
        className={styles.sectionLeft + " " + styles.sectionHero}
      >
        <header>
          <h1>
            <strong>spline/</strong>code <sup>Demo</sup>
          </h1>
          <nav>
            <a href="https://lol3p7.csb.app/" rel="noreferrer">
              / work
            </a>
            <a
              href="https://2giomw.csb.app/"
              target="_blank"
              rel="noreferrer"
              className={styles.selected}
            >
              / relax
            </a>
          </nav>
        </header>
        <p>
          Welcome to my portfolio.
          <br />
          Scroll this page to explore!
        </p>
        <p>
          <svg
            width="30"
            height="71"
            viewBox="0 0 30 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1.5"
              y="1.5"
              width="27"
              height="45"
              rx="13.5"
              stroke="#2D3A94"
              stroke-opacity="0.6"
              stroke-width="3"
            />
            <path
              d="M15 12V20"
              stroke="#2D3A94"
              stroke-opacity="0.6"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M8 54L14.5 60.5L21 54"
              stroke="#2D3A94"
              stroke-opacity="0.6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 63L14.5 69.5L21 63"
              stroke="#2D3A94"
              stroke-opacity="0.6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </p>
      </section>
      <section style={{ height: "100vh" }} className={styles.sectionLeft}>
        <p>
          My name is Max.
          <br />
          As you can see I like plants,
          <br />
          design, and coffee.
        </p>
      </section>
      <section style={{ height: "100vh" }} className={styles.sectionLeft}>
        <p>
          In my free time
          <br />
          I like to code and
          <br />
          make 3D designs with Spline!
        </p>
      </section>
      <section style={{ height: "100vh" }} className={styles.sectionRight}>
        <p>
          In fact, I was built entirely with{" "}
          <a href="https://spline.design" target="_blank" rel="noreferrer">
            Spline
          </a>
          !<br />
          With love, by the Spline Team.
        </p>
        <p style={{ marginBottom: "300px" }}>PS: I have a conscience now... </p>
      </section>
    </div>
  );
}
