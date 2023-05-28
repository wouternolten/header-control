async function getCurrentTabHostName() {
  return new Promise((res, rej) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        rej(new Error('No active tab found'));
        return;
      }

      res(new URL(tabs[0].url).hostname);
    });
  });
}

async function getAllCurrentActiveHeaders() {
  return new Promise((res) => {
    chrome.storage.local.get('headers', async (data) => {
      if (!data || !data.headers) {
        res({});
      }

      res(data.headers);
    });
  });
}

async function getCurrentActiveHeadersForHost(hostName) {
  if (!chrome || !chrome.storage || !chrome.storage.local) {
    throw new Error('Unable to find local storage');
  }

  if (!hostName) {
    return [];
  }

  return new Promise((res) => {
    chrome.storage.local.get('headers', async (data) => {
      if (!data || !data.headers || !data.headers[hostName]) {
        res([]);
        return;
      }

      res(data.headers[hostName]);
    });
  });
}

function addHeaderField(headerName, headerValue) {
  const headersDiv = document.getElementById('headers');

  const headerDiv = document.createElement('div');

  const headerNameField = document.createElement('input');
  headerNameField.type = 'text';
  headerNameField.placeholder = 'Header Name';

  if (headerName) {
    headerNameField.value = headerName;
  }

  const headerValueField = document.createElement('input');
  headerValueField.type = 'text';
  headerValueField.placeholder = 'Header Value';

  if (headerValue) {
    headerValueField.value = headerValue;
  }

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('bg-red');
  deleteButton.textContent = 'X';

  deleteButton.addEventListener('click', () => {
    headersDiv.removeChild(headerDiv);
  });

  headerDiv.appendChild(headerNameField);
  headerDiv.appendChild(headerValueField);
  headerDiv.appendChild(deleteButton);

  headersDiv.appendChild(headerDiv);
}

async function addExistingHeadersForTab() {
  let headers;

  try {
    const hostName = await getCurrentTabHostName();
    headers = await getCurrentActiveHeadersForHost(hostName);

    headers.forEach((header) => {
      addHeaderField(header.name, header.value);
    });
  } catch (error) {
    console.error(error);
  }
}

function addSliderControls() {
  const slider = document.getElementById('slider');

  slider.addEventListener('change', (element) => {
    if (element.target.value < 1) {
      document.getElementById('slider-label').innerHTML = 'Disabled';
      return;
    }

    document.getElementById('slider-label').innerHTML = 'Enabled';
  });
}

function addCreateHeaderControls() {
  const button = document.getElementById('addHeader');

  button.addEventListener('click', () => { addHeaderField(); });
}

function addSaveHeaderControls() {
  const saveHeadersButton = document.getElementById('saveHeaders');

  saveHeadersButton.addEventListener('click', async () => {
    const headersDiv = document.getElementById('headers');
    const headerList = Array.from(headersDiv.children);
    const headers = headerList.map((header) => {
      const [nameEl, valueEl] = header.children;
      return { name: nameEl.value, value: valueEl.value };
    });

    const hostname = await getCurrentTabHostName();
    const activeHeaders = await getAllCurrentActiveHeaders();

    activeHeaders[hostname] = headers;

    chrome.storage.local.set({ headers: activeHeaders });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await addExistingHeadersForTab();
  addSliderControls();
  addCreateHeaderControls();
  addSaveHeaderControls();
});
