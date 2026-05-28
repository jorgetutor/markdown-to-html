import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const markdownInput = document.getElementById('markdown-input');
const htmlOutput = document.getElementById('html-output');
const htmlPreview = document.getElementById('html-preview');
const copyButton = document.getElementById('copy-button');
const clearButton = document.getElementById('clear-button');
const autocopyToggle = document.getElementById('autocopy-toggle');
const globalStatus = document.getElementById('global-status');
const fileInput = document.getElementById('file-input');
const openFileButton = document.getElementById('open-file-button');
const markdownSection = document.getElementById('markdown-section');
const dropOverlay = document.getElementById('drop-overlay');

function renderMarkdown() {
  const markdown = markdownInput.value || '';
  const html = md.render(markdown);
  htmlOutput.value = html;
  htmlPreview.innerHTML = html;
  copyButton.disabled = !html.trim();
}

function updateStatus(message) {
  globalStatus.textContent = message;
  window.clearTimeout(updateStatus._timeout);
  updateStatus._timeout = window.setTimeout(() => {
    globalStatus.textContent = '';
  }, 1800);
}

function copyHtml() {
  const html = htmlOutput.value;
  if (!html.trim()) return;

  navigator.clipboard
    .writeText(html)
    .then(() => updateStatus('Copied to clipboard!'))
    .catch(() => updateStatus('Copy failed. Use browser copy command.'));
}

function handlePaste(event) {
  window.setTimeout(() => {
    renderMarkdown();
    if (autocopyToggle.checked) {
      copyHtml();
    }
  }, 0);
}

function clearMarkdown() {
  markdownInput.value = '';
  renderMarkdown();
  updateStatus('Markdown cleared.');
  markdownInput.focus();
}

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    markdownInput.value = e.target.result;
    renderMarkdown();
    if (autocopyToggle.checked) copyHtml();
    updateStatus(`Loaded: ${file.name}`);
  };
  reader.onerror = () => updateStatus('Failed to read file.');
  reader.readAsText(file);
}

let dragCounter = 0;

markdownSection.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  dropOverlay.classList.remove('hidden');
});

markdownSection.addEventListener('dragleave', () => {
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    dropOverlay.classList.add('hidden');
  }
});

markdownSection.addEventListener('dragover', (e) => {
  e.preventDefault();
});

markdownSection.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  dropOverlay.classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});

openFileButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) loadFile(file);
  fileInput.value = '';
});

markdownInput.addEventListener('input', renderMarkdown);
markdownInput.addEventListener('paste', handlePaste);
markdownInput.addEventListener('blur', () => {
  if (autocopyToggle.checked) copyHtml();
});
copyButton.addEventListener('click', copyHtml);
clearButton.addEventListener('click', clearMarkdown);

renderMarkdown();
