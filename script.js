if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener(
  "load",
  function () {
    window.scrollTo(0, 0);
  },
  { once: true }
);

// Public FormSubmit alias generated for this form. It is safe to keep in client-side code.
const FORM_TOKEN = "41f939a6574de3488b91b07a4ab5266b";
const FORM_ENDPOINT = `https://formsubmit.co/${FORM_TOKEN}`;
const CALENDLY_BASE_URL = "https://calendly.com/qa-services/qa-service-intro-call";

const SERVICES = {
  "product-quality": {
    name: "Critical User Flow Testing",
    subject: "Critical User Flow Testing enquiry",
  },
  "process-coverage": {
    name: "QA Process & Test Coverage Audit",
    subject: "QA Process & Test Coverage Audit enquiry",
  },
};

let selectedServiceId = null;
let submissionPending = false;

function setStatus(message, type = "") {
  const status = document.getElementById("form-status");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle("is-error", type === "error");
}

function updateSelectedState(serviceId) {
  document.querySelectorAll(".select-audit").forEach((button) => {
    const pressed = button.getAttribute("data-audit") === serviceId;
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
  });

  document.querySelectorAll(".package").forEach((card) => {
    card.classList.toggle("is-selected", card.id === serviceId);
  });
}

function setDialogView(view) {
  const choiceView = document.getElementById("enquiry-choice-view");
  const formView = document.getElementById("enquiry-form-view");
  const successView = document.getElementById("enquiry-success");

  if (choiceView) {
    choiceView.hidden = view !== "choice";
  }
  if (formView) {
    formView.hidden = view !== "form";
  }
  if (successView) {
    successView.hidden = view !== "success";
  }
}

function showChoiceView() {
  setStatus("");
  setDialogView("choice");

  const requestPath = document.getElementById("continue-by-request");
  if (requestPath) {
    window.requestAnimationFrame(() => requestPath.focus());
  }
}

function showFormView() {
  setStatus("");
  setDialogView("form");

  const emailInput = document.getElementById("visitor-email");
  if (emailInput) {
    window.requestAnimationFrame(() => emailInput.focus());
  }
}

function showSuccessView() {
  setDialogView("success");
}

function selectService(serviceId) {
  const service = SERVICES[serviceId];
  const dialog = document.getElementById("enquiry-dialog");
  const choiceName = document.getElementById("selected-choice-service-name");
  const formName = document.getElementById("selected-audit-name");
  const serviceField = document.getElementById("audit-field");
  const subjectField = document.getElementById("subject-field");
  const callPath = document.getElementById("continue-by-call");

  if (!service || !dialog || !choiceName || !formName || !serviceField || !subjectField) {
    return;
  }

  selectedServiceId = serviceId;
  updateSelectedState(serviceId);

  choiceName.textContent = service.name;
  formName.textContent = service.name;
  serviceField.value = service.name;
  subjectField.value = service.subject;

  if (callPath) {
    callPath.href = CALENDLY_BASE_URL;
  }

  showChoiceView();

  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeDialog() {
  const dialog = document.getElementById("enquiry-dialog");
  if (dialog && dialog.open) {
    dialog.close();
  }
}

async function openSampleReport(source, title) {
  const viewer = window.open("", "_blank");

  if (!viewer) {
    window.alert("Please allow pop-ups to open the sample report.");
    return;
  }

  viewer.document.title = title || "Sample report";
  viewer.document.body.innerHTML = "<p style=\"font-family:system-ui,sans-serif;padding:24px;color:#475467\">Loading sample report…</p>";

  try {
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load sample report: ${response.status}`);
    }

    const base64 = (await response.text()).trim();
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    viewer.location.replace(blobUrl);

    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
  } catch (error) {
    viewer.close();
    window.alert("The sample report could not be opened. Please try again.");
  }
}

function initSampleReports() {
  document.querySelectorAll(".sample-report-link").forEach((button) => {
    button.addEventListener("click", function () {
      const source = button.getAttribute("data-sample-src");
      const title = button.getAttribute("data-sample-name") || "Sample report";

      if (!source) {
        return;
      }

      openSampleReport(source, title);
    });
  });
}

function initEnquiry() {
  const form = document.getElementById("enquiry-form");
  const dialog = document.getElementById("enquiry-dialog");
  const closeButton = document.getElementById("dialog-close");
  const requestPath = document.getElementById("continue-by-request");
  const callPath = document.getElementById("continue-by-call");
  const backButton = document.getElementById("choice-back");
  const successCloseButton = document.getElementById("success-close");
  const emailInput = document.getElementById("visitor-email");
  const replytoField = document.getElementById("replyto-field");
  const submitButton = document.getElementById("enquiry-submit");
  const submitTarget = document.getElementById("formsubmit-target");

  if (!form || !dialog || !emailInput || !replytoField || !submitButton || !submitTarget) {
    return;
  }

  form.action = FORM_ENDPOINT;

  document.querySelectorAll(".select-audit").forEach((button) => {
    button.addEventListener("click", function () {
      selectService(button.getAttribute("data-audit"));
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeDialog);
  }

  if (requestPath) {
    requestPath.addEventListener("click", showFormView);
  }

  if (callPath) {
    callPath.addEventListener("click", closeDialog);
  }

  if (backButton) {
    backButton.addEventListener("click", showChoiceView);
  }

  if (successCloseButton) {
    successCloseButton.addEventListener("click", closeDialog);
  }

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  form.addEventListener("submit", function (event) {
    if (!selectedServiceId) {
      event.preventDefault();
      setStatus("Select a service before sending a request.", "error");
      return;
    }

    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    replytoField.value = emailInput.value.trim();
    submissionPending = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    setStatus("");
  });

  submitTarget.addEventListener("load", function () {
    if (!submissionPending) {
      return;
    }

    submissionPending = false;
    submitButton.disabled = false;
    submitButton.textContent = "Send request";
    form.reset();
    showSuccessView();

    if (successCloseButton) {
      window.requestAnimationFrame(() => successCloseButton.focus());
    }
  });
}

initSampleReports();
initEnquiry();
