//@ts-check
// Starting code from Claude AI
const html = String.raw;
class TableOfContents extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupObserver();
  }

  render() {
    const headings = this.getHeadings();

    const style = html`
      <style>
        :host {
          display: block;
          position: sticky;
          top: 20px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .toc-container {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
        }

        .toc-title {
          margin: 0 0 15px 0;
          font-size: 1.2em;
          font-weight: 600;
          color: #212529;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-item {
          margin: 0;
        }

        .toc-link {
          display: block;
          padding: 6px 0;
          color: #495057;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 0.95em;
        }

        .toc-link:hover {
          color: #007bff;
        }

        .toc-link.active {
          color: #007bff;
          font-weight: 600;
        }

        .toc-item[data-level="1"] .toc-link {
          font-weight: 600;
          font-size: 1em;
        }

        .toc-item[data-level="2"] .toc-link {
          padding-left: 15px;
        }

        .toc-item[data-level="3"] .toc-link {
          padding-left: 30px;
          font-size: 0.9em;
        }

        .toc-item[data-level="4"] .toc-link {
          padding-left: 45px;
          font-size: 0.85em;
        }

        .toc-item[data-level="5"] .toc-link {
          padding-left: 60px;
          font-size: 0.85em;
        }

        .toc-item[data-level="6"] .toc-link {
          padding-left: 75px;
          font-size: 0.85em;
        }
      </style>
    `;

    const tocHTML = html`
      <div class="toc-container">
        <h2 class="toc-title" part="toc-title">Table of Contents</h2>
        <ul class="toc-list" part="toc-list">
          ${this.buildTOCItems(headings)}
        </ul>
      </div>
    `;

    this.shadowRoot.innerHTML = style + tocHTML;
    this.setupScrollSpy();
  }

  getHeadings() {
    const selector = this.getAttribute("selector") || "h1, h2, h3, h4, h5, h6";
    const headings = Array.from(document.querySelectorAll(selector));

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });

    return headings;
  }

  buildTOCItems(headings) {
    return headings
      .map((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent;
        const id = heading.id;

        return html`
          <li class="toc-item" part="toc-item" data-level="${level}">
            <a
              href="#${id}"
              popovertargetaction="hide"
              class="toc-link"
              part="toc-link"
              data-target="${id}"
              >${text}</a
            >
          </li>
        `;
      })
      .join("");
  }

  setupScrollSpy() {
    const links = this.shadowRoot.querySelectorAll(".toc-link");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        //e.preventDefault();
        const targetId = link.getAttribute("data-target");
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", `#${targetId}`);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            const activeLink = this.shadowRoot.querySelector(
              `[data-target="${entry.target.id}"]`,
            );
            if (activeLink) {
              activeLink.classList.add("active");
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      },
    );

    this.getHeadings().forEach((heading) => {
      observer.observe(heading);
    });
  }

  setupObserver() {
    const observer = new MutationObserver(() => {
      this.render();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

customElements.define("toc-ky", TableOfContents);
