let legalReturnFocus = null;

function closeLegalDialog() {
  const dialog = document.getElementById("legal-dialog");
  if (dialog && dialog.open) {
    dialog.close();
  }
}

async function openLegalDocument(link) {
  const dialog = document.getElementById("legal-dialog");
  const title = document.getElementById("legal-dialog-title");
  const content = document.getElementById("legal-dialog-content");
  const closeButton = document.getElementById("legal-dialog-close");

  if (!dialog || !title || !content || !link) {
    return;
  }

  const href = link.getAttribute("href");
  const requestedTitle = link.getAttribute("data-legal-title") || link.textContent.trim();

  if (!href) {
    return;
  }

  legalReturnFocus = link;
  title.textContent = requestedTitle;
  content.innerHTML = '<p class="legal-loading">Loading…</p>';

  if (!dialog.open) {
    dialog.showModal();
  }

  try {
    const response = await fetch(href, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load legal document: ${response.status}`);
    }

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const main = parsed.querySelector("main.legal-page") || parsed.querySelector("main");

    if (!main) {
      throw new Error("Legal document content not found");
    }

    const backLinkParagraph = main.querySelector(":scope > p:first-child");
    if (backLinkParagraph && backLinkParagraph.querySelector('a[href="index.html"]')) {
      backLinkParagraph.remove();
    }

    const heading = main.querySelector("h1");
    if (heading) {
      title.textContent = heading.textContent.trim() || requestedTitle;
      heading.remove();
    }

    content.innerHTML = main.innerHTML;
  } catch (error) {
    content.innerHTML = `<p class="legal-error">This document could not be loaded here. <a href="${href}" target="_blank" rel="noopener noreferrer">Open the full page</a>.</p>`;
  }

  if (closeButton) {
    window.requestAnimationFrame(() => closeButton.focus());
  }
}

function initLegalDocuments() {
  const dialog = document.getElementById("legal-dialog");
  const closeButton = document.getElementById("legal-dialog-close");

  document.querySelectorAll(".legal-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openLegalDocument(link);
    });
  });

  if (!dialog) {
    return;
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeLegalDialog);
  }

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeLegalDialog();
    }
  });

  dialog.addEventListener("close", function () {
    if (legalReturnFocus && typeof legalReturnFocus.focus === "function") {
      legalReturnFocus.focus();
    }
    legalReturnFocus = null;
  });
}

initLegalDocuments();
