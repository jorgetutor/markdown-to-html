import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const markdownInput = document.getElementById('markdown-input');
const htmlOutput = document.getElementById('html-output');
const htmlPreview = document.getElementById('html-preview');
const copyButton = document.getElementById('copy-button');
const clearButton = document.getElementById('clear-button');
const autocopyToggle = document.getElementById('autocopy-toggle');
const status = document.getElementById('status');
const globalStatus = document.getElementById('global-status');

function renderMarkdown() {
  const markdown = markdownInput.value || '';
  const html = md.render(markdown);
  htmlOutput.value = html;
  htmlPreview.innerHTML = html;
}

function updateStatus(message) {
  status.textContent = message;
  globalStatus.textContent = message;
  window.clearTimeout(updateStatus._timeout);
  updateStatus._timeout = window.setTimeout(() => {
    status.textContent = '';
    globalStatus.textContent = '';
  }, 1800);
}

function copyHtml() {
  const html = htmlOutput.value;
  if (!html) {
    updateStatus('Nothing to copy yet.');
    return;
  }

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

markdownInput.addEventListener('input', renderMarkdown);
markdownInput.addEventListener('paste', handlePaste);
copyButton.addEventListener('click', copyHtml);
clearButton.addEventListener('click', clearMarkdown);

renderMarkdown();
