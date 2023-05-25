// eslint-disable-next-line no-undef
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    details.requestHeaders.push({ name: 'some_header', value: 'some_value' });
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);
