import { request } from "../utils";
const baseUrl = "/fuye1000/api";

export const getOnlineDbs = payload =>
  request({
    method: "get",
    url: `${baseUrl}/answerDbs/getAnswerDbs`,
    params: payload
  });

export const onlineAnswerDb = payload =>
  request({
    url: `${baseUrl}/answerDbs/onlineAnswerDb`,
    method: "post",
    data: payload
  });

export const offlineAnswerDb = payload =>
  request({
    url: `${baseUrl}/answerDbs/offlineAnswerDb`,
    method: "put",
    data: payload
  });

export const deleteLineDb = payload =>
  request({
    url: `${baseUrl}/answerDbs/deleteLineDb`,
    method: "delete",
    data: payload
  });

export const updateLineDb = payload =>
  request({
    url: `${baseUrl}/answerDbs/updateLineDb`,
    method: "put",
    data: payload
  });

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
    method: "put",
    data: payload
  });

export const offlineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/offlineAnswer`,
    method: "put",
    data: payload
  });

export const deleteLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/deleteLineAnswer`,
    method: "delete",
    data: payload
  });

export const updateLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/updateLineAnswer`,
    method: "put",
    data: payload
  });

export const checkLineAnswer = payload =>
  request({
    url: `${baseUrl}/answers/checkLineAnswer`,
    method: "post",
    data: payload
  });

export const getUsers = payload =>
  request({
    method: "get",
    url: `api/user/getUsers`,
    params: payload
  });

export const getBlackUsers = payload =>
  request({
    method: "get",
    url: `api/userBlackList/getBlackUsers`,
    params: payload
  });

export const operationUserBlackList = payload =>
  request({
    url: `api/userBlackList/operationUserBlackList`,
    method: "post",
    data: payload
  });

export const getWebsiteConfig = payload =>
  request({
    method: "get",
    url: `api/websiteConfig/getWebsiteConfig`,
    params: payload
  });

export const operationWebsiteConfig = payload =>
  request({
    url: `api/websiteConfig/operationWebsiteConfig`,
    method: "post",
    data: payload
  });
