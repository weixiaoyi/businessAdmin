import { request } from "../utils";
const baseUrl = "/fuye1000/api";

export const getAnswers = payload =>
  request({
    method: "get",
    url: `${baseUrl}/answers/getAnswers`,
    params: payload
  });

export const uploadAnswer = payload =>
  request({
    url: `${baseUrl}/answers/uploadAnswer`,
    method: "post",
    data: payload
  });

export const onlineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/onlineAnswer`,
    method: "post",
    data: payload
  });

export const offlineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/offlineAnswer`,
    method: "post",
    data: payload
  });

export const deleteLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/deleteLineAnswer`,
    method: "post",
    data: payload
  });

export const updateLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/updateLineAnswer`,
    method: "post",
    data: payload
  });

export const checkLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/checkLineAnswer`,
    method: "post",
    data: payload
  });