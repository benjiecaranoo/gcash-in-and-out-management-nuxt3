export const useErrors = (validator: any, form: any, errorFields: any) => {
  function getErrors(validator, form, errorFields) {
    return Object.keys({ ...form }).reduce((prev, curr) => {
      let message =
        validator[curr]?.$errors[0]?.$message ?? errorFields?.[curr];

      let errorCount = 0;
      if (errorFields) {
        errorCount = Object.keys(errorFields).filter((key) =>
          key.startsWith(`${curr}.`),
        ).length;
      }

      if (!message && errorCount > 0) {
        const messages = [];
        for (let i = 0; i < errorCount; i++) {
          let key = `${curr}.${i}`;
          if (errorFields[key]) {
            messages.push(errorFields[key][0]);
          }
        }
        message = messages[0];
      }

      prev[curr] = message;
      return prev;
    }, {});
  }

  const errors = ref({});
  watchEffect(() => {
    errors.value = getErrors(validator, toValue(form), toValue(errorFields));
  });

  return { errors };
};
