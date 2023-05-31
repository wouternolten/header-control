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

function createElementWithClassNames(elementType, classNames) {
  const element = document.createElement(elementType);

  classNames.forEach((className) => {
    element.classList.add(className);
  });

  return element;
}

function addHeaderField(headerName, headerValue) {
  const headersDiv = document.getElementById('headers');

  const headerDiv = createElementWithClassNames('div', ['row', 'my-1']);

  const headerNameColumn = createElementWithClassNames('div', ['col-5']);
  const headerNameField = createElementWithClassNames('input', ['form-control']);
  headerNameField.type = 'text';
  headerNameField.placeholder = 'Header Name';
  headerNameColumn.appendChild(headerNameField);

  if (headerName) {
    headerNameField.value = headerName;
  }

  const headerValueColumn = createElementWithClassNames('div', ['col-5']);
  const headerValueField = createElementWithClassNames('input', ['form-control']);
  headerValueField.type = 'text';
  headerValueField.placeholder = 'Header Value';
  headerValueColumn.appendChild(headerValueField);

  if (headerValue) {
    headerValueField.value = headerValue;
  }

  const deleteButtonColumn = createElementWithClassNames('div', ['col-1']);
  const deleteButton = createElementWithClassNames('button', ['btn', 'btn-danger']);
  deleteButton.textContent = 'X';
  deleteButtonColumn.appendChild(deleteButton);

  deleteButton.addEventListener('click', () => {
    headersDiv.removeChild(headerDiv);
  });

  headerDiv.appendChild(headerNameColumn);
  headerDiv.appendChild(headerValueColumn);
  headerDiv.appendChild(deleteButtonColumn);

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
