import axios from "axios";
import { stringify } from "qs";
import { message } from "antd";
import _ from "lodash";
import { generateAccessToken } from "./encrypt";

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.maxContentLength = 20000000;

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const request = (options = {}) => {
  const {
    url,
    method = "get",
    formData = false,
    params,
    data,
    timeout = 10000,
    ...rest
  } = options;
  return axios({
    ...{
      headers: {
        Authorization: generateAccessToken(),
        signature: generateAccessToken()
      },
      method,
      params,
      data,
      url,
      baseURL: "",
      timeout
    },
    ...(formData
      ? {
          transformRequest: [
            (data, headers) => {
              headers["Content-Type"] = "application/x-www-form-urlencoded";
              data = stringify(data);
              return data;
            }
          ]
        }
      : {}),
    ...rest
  })
    .then(res => {
      // console.log(res, "----res");
      const { status, data } = res || {};
      if (!data) return Promise.reject("请求响应失败");
      if (data && data.code === -1) return Promise.reject(data.msg);
      return {
        ...data,
        status
      };
    })
    .catch(error => {
      _.isString(error) && message.error(error);
      return Promise.reject(error);
    });
};
