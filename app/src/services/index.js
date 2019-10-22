import { request } from "../utils";
const SERVICEHOST = "http://localhost:7001";
const FUYE = `${SERVICEHOST}/fuye1000/api`;

export const getUsers = payload =>
  request({
    method: "get",
    url: `${SERVICEHOST}/api/user/getUsers`,
    params: payload
  });

export const getBlackUsers = payload =>
  request({
    method: "get",
    url: `${SERVICEHOST}/api/userBlackList/getBlackUsers`,
    params: payload
  });

export const operationUserBlackList = payload =>
  request({
    url: `${SERVICEHOST}/api/userBlackList/operationUserBlackList`,
    method: "post",
    data: payload
  });

export const getWebsiteConfig = payload =>
  request({
    method: "get",
    url: `${SERVICEHOST}/api/websiteConfig/getWebsiteConfig`,
    params: payload
  });

export const operationWebsiteConfig = payload =>
  request({
    url: `${SERVICEHOST}/api/websiteConfig/operationWebsiteConfig`,
    method: "post",
    data: payload
  });

export const getOnlineDbs = payload =>
  request({
    method: "get",
    url: `${FUYE}/answerDbs/getAnswerDbs`,
    params: payload
  });

export const onlineAnswerDb = payload =>
  request({
    url: `${FUYE}/answerDbs/onlineAnswerDb`,
    method: "post",
    data: payload
  });

export const offlineAnswerDb = payload =>
  request({
    url: `${FUYE}/answerDbs/offlineAnswerDb`,
    method: "put",
    data: payload
  });

export const deleteLineDb = payload =>
  request({
    url: `${FUYE}/answerDbs/deleteLineDb`,
    method: "delete",
    data: payload
  });

export const updateLineDb = payload =>
  request({
    url: `${FUYE}/answerDbs/updateLineDb`,
    method: "put",
    data: payload
  });

export const getAnswers = payload =>
  request({
    method: "get",
    url: `${FUYE}/answers/getAnswers`,
    params: payload
  });

export const uploadAnswer = payload =>
  request({
    url: `${FUYE}/answers/uploadAnswer`,
    method: "post",
    data: payload
  });

export const onlineAnswer = payload =>
  request({
    url: `${FUYE}/answers/onlineAnswer`,
    method: "put",
    data: payload
  });

export const offlineAnswer = payload =>
  request({
    url: `${FUYE}/answers/offlineAnswer`,
    method: "put",
    data: payload
  });

export const deleteLineAnswer = payload =>
  request({
    url: `${FUYE}/answers/deleteLineAnswer`,
    method: "delete",
    data: payload
  });

export const updateLineAnswer = payload =>
  request({
    url: `${FUYE}/answers/updateLineAnswer`,
    method: "put",
    data: payload
  });

export const checkLineAnswer = payload =>
  request({
    url: `${FUYE}/answers/checkLineAnswer`,
    method: "post",
    data: payload
  });

export const getIdeasPreview = payload =>
  request({
    method: "get",
    url: `${FUYE}/ideas/getIdeasPreview`,
    params: payload
  });

export const getIdeasComments = payload =>
  request({
    method: "get",
    url: `${FUYE}/ideaComments/getComments`,
    params: payload
  });

export const inspectIdea = payload =>
  request({
    url: `${FUYE}/ideas/inspectIdea`,
    method: "put",
    data: payload
  });

export const inspectIdeaComment = payload =>
  request({
    url: `${FUYE}/ideaComments/inspectComment`,
    method: "put",
    data: payload
  });

export const getGroups = payload =>
  request({
    url: `${FUYE}/group/getGroups`,
    method: "get",
    params: payload
  });

export const addGroup = payload =>
  request({
    url: `${FUYE}/group/addGroup`,
    method: "post",
    data: payload
  });

export const updateGroup = payload =>
  request({
    url: `${FUYE}/group/updateGroup`,
    method: "put",
    data: payload
  });

export const deleteGroup = payload =>
  request({
    url: `${FUYE}/group/deleteGroup`,
    method: "delete",
    data: payload
  });

export const getSensitiveWord = payload =>
  request({
    url: `${SERVICEHOST}/api/sensitiveWord/getSensitiveWord`,
    method: "get",
    params: payload
  });

export const addSensitiveWord = payload =>
  request({
    url: `${SERVICEHOST}/api/sensitiveWord/addSensitiveWord`,
    method: "post",
    data: payload
  });

export const updateSensitiveWord = payload =>
  request({
    url: `${SERVICEHOST}/api/sensitiveWord/updateSensitiveWord`,
    method: "put",
    data: payload
  });

export const deleteSensitiveWord = payload =>
  request({
    url: `${SERVICEHOST}/api/sensitiveWord/deleteSensitiveWord`,
    method: "delete",
    data: payload
  });
