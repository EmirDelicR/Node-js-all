export const setServerConfigJSON = config => {
  return {
    method: config.method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(config.data)
  };
};

export const setServerConfigFILE = config => {
  const formData = setFormData(config.data);
  return {
    method: config.method,
    body: formData
  };
};

export const setAuthorization = token => {
  return {
    headers: {
      Authorization: "Bearer " + token
    }
  };
};

const setFormData = data => {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }

  return formData;
};
