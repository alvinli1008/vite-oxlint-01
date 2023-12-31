const formObj = {
  _formData: {},
  _fieldsList: {},
  _initialValues: {},
  _callbacks: {},

  setFieldsValue: function (values) {
    this._formData = { ...this._formData, ...values };
    this.notifyField(values);
    Object.keys(values).forEach((key) => {
      if (key in this._fieldsList) {
        this._fieldsList[key]?.onValueChange();
      }
    });
    return true;
  },
  setFiledValue: function (name, value) {
    this._formData = { ...this._formData, [name]: value };
    const { onValuesChange } = this._callbacks;
    if (onValuesChange) {
      onValuesChange(
        {
          [name]: value,
        },
        this._formData,
      );
    }
    this.notifyField({ [name]: value });
    return true;
  },
  notifyField: function (values) {
    Object.keys(values).map((filedName) => {
      const filedObj = this._fieldsList?.[filedName] || null;
      if (filedObj) {
        filedObj.onValueChange(values[filedName]);
      }
    });
  },
  getFieldsValue: function (names) {
    if (names) {
      return names.map((name) => this.getFieldValue(name));
    }
    return this._formData;
  },
  getFieldValue: function (name) {
    return this._formData?.[name];
  },
  getFieldError: function (name) {
    const field = this._fieldsList?.[name] || null;
    if (field) {
      return field.getFieldError();
    }
    return [];
  },
  getFieldsError: function (names) {
    const fields = names || Object.keys(this._fieldsList);
    return fields.reduce((pre, name) => {
      const theFiled = this._fieldsList?.[name];
      if (theFiled) {
        pre[name] = theFiled?.getFieldError();
      }
      return pre;
    }, {});
  },
  isFieldTouched: function (name) {
    const field = this._fieldsList?.[name] || [];
    if (field) {
      return field.isFieldTouched();
    }
    return false;
  },
  registerField: function (name, self) {
    this._fieldsList[name] = self;
    const { initialValue } = self;
    if (initialValue !== undefined && name) {
      this._initialValues = {
        ...this._initialValues,
        [name]: initialValue,
      };
      this.setFieldsValue({
        ...this._formData,
        [name]: initialValue,
      });
    }
    return () => {
      if (name in this._fieldsList) {
        delete this._fieldsList[name];
        delete this._formData[name];
      }
    };
  },
  setInitialValues: function (initVal) {
    this._initialValues = { ...(initVal || {}) };
    this.setFieldsValue(initVal);
  },
  resetFields: function () {
    this.setFieldsValue(this._initialValues);
  },
  validateFields: function () {
    const promiseList = [];
    Object.values(this._fieldsList).forEach((entity) => {
      const promise = entity.validateField();
      promiseList.push(promise.then((errors) => errors));
    });
    const summaryPromise = new Promise((resolve, reject) => {
      Promise.all(promiseList).then((res) => {
        const errorResults = res.filter((item) => item?.errors?.length);
        if (errorResults.length) {
          reject(errorResults);
        } else {
          resolve(res);
        }
      });
    });
    return summaryPromise;
  },
  submit: function () {
    this.validateFields()
      .then((result) => {
        const { onSubmit } = this._callbacks;
        onSubmit?.(this._formData, result);
      })
      .catch((e) => {
        const { onSubmitFailed } = this._callbacks;
        if (!onSubmitFailed) {
          return;
        }
        onSubmitFailed(this._formData, e);
      });
  },
  setCallbacks: function (callbacks) {
    this._callbacks = callbacks;
  },
  getMethods: function () {
    return {
      setFieldsValue: this.setFieldsValue,
      setFieldValue: this.setFieldValue,
      getFieldsValue: this.getFieldsValue,
      getFieldValue: this.getFieldValue,
      getFieldError: this.getFieldError,
      getFieldsError: this.getFieldsError,
      isFieldTouched: this.isFieldTouched,
      registerField: this.registerField,
      resetFields: this.resetFields,
      submit: this.submit,
      getInternalHooks: this.getInternalHooks,
      validateFields: this.validateFields,
    };
  },
  getInternalHooks: function () {
    return {
      registerField: this.registerField,
      setInitialValues: this.setInitialValues,
      setCallbacks: this.setCallbacks,
    };
  },
};

export default formObj;
