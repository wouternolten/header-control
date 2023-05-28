/**
 * The reason to use a mutable value for headers
 * instead of getting them before onBeforeSendHeaders():
 * onBeforeSendHeaders() is a synchronous function,
 * while the storage getter is an asynchronous function.
 * So, that will cause the retrieved values from storage
 * to be added after headers.
 *
 * @typedef {{[hostName: string]: [{name: string, value: string}]}} headers
 */
let headers = {};

function setAllCurrentActiveHeaders() {
  chrome.storage.local.get('headers', async (data) => {
    if (data && data.headers) {
      headers = data.headers;
    }
  });
}

function getCurrentActiveHeadersForHost(hostName) {
  if (!hostName || !headers[hostName]) {
    return [];
  }

  return headers[hostName];
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'local' || !changes.headers || !changes.headers.newValue) {
    return;
  }

  headers = changes.headers.newValue;
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const { url, requestHeaders } = details;
    const hostName = new URL(url).hostname;
    const currentActiveHeaders = getCurrentActiveHeadersForHost(hostName);

    return { requestHeaders: [...requestHeaders, ...currentActiveHeaders] };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);

setAllCurrentActiveHeaders();
