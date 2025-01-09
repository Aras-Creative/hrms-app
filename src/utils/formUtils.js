const updateStateByPath = (path, value, setFormData) => {
  setFormData((prevState) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const updatedState = { ...prevState };
    let target = updatedState;

    keys.forEach((key) => {
      target = target[key];
    });

    target[lastKey] = value;

    return updatedState;
  });
};

const handleAddItemToArray = (path, newItem, uniqueKey, setFormData) => {
  setFormData((prevState) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const target = keys.reduce((obj, key) => obj[key], prevState);

    if (!Array.isArray(target[lastKey])) {
      console.error("The path does not point to an array.");
      return prevState;
    }

    const isDuplicate = uniqueKey
      ? target[lastKey].some((item) => item[uniqueKey] === newItem[uniqueKey])
      : target[lastKey].some((item) => JSON.stringify(item) === JSON.stringify(newItem));

    if (!isDuplicate) {
      target[lastKey] = [...target[lastKey], newItem];
    }

    return { ...prevState };
  });
};

const handleUpdateItemInArray = (path, index, key, value, setFormData) => {
  setFormData((prevState) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const updatedState = { ...prevState };
    let target = updatedState;
    keys.forEach((key) => {
      target = target[key];
    });

    if (!Array.isArray(target[lastKey])) {
      console.error("The path does not point to an array.");
      return prevState;
    }

    target[lastKey] = target[lastKey].map((item, i) => (i === index ? { ...item, [key]: value } : item));

    return updatedState;
  });
};

const handleDeleteItemFromArray = (path, index, setFormData) => {
  setFormData((prevState) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const updatedState = { ...prevState };
    let target = updatedState;

    // Traverse to the array that needs to be updated
    keys.forEach((key) => {
      target = target[key];
    });

    // Ensure that the last key points to an array before removing an item
    if (!Array.isArray(target[lastKey])) {
      console.error("The path does not point to an array.");
      return prevState;
    }

    // Remove the item from the array
    target[lastKey] = target[lastKey].filter((_, i) => i !== index);

    return updatedState;
  });
};

const handleNestedValueChange = (path, idx, key, value, setFormData) => {
  setFormData((prevState) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], prevState);

    if (!Array.isArray(target[lastKey])) {
      console.error("The path does not point to an array.");
      return prevState;
    }

    const updatedArray = [...target[lastKey]];
    updatedArray[idx] = { ...updatedArray[idx], [key]: value };

    return {
      ...prevState,
      [keys[0]]: {
        ...prevState[keys[0]],
        [lastKey]: updatedArray,
      },
    };
  });
};

const handleCurrencyInput = (formName, field, setFormData) => (value) => {
  setFormData((prevState) => ({
    ...prevState,
    [formName]: {
      ...prevState[formName],
      [field]: value,
    },
  }));
};

export { updateStateByPath, handleAddItemToArray, handleUpdateItemInArray, handleDeleteItemFromArray, handleNestedValueChange, handleCurrencyInput };
