import { request } from "../utils";
const baseUrl = "/fuye1000/api";

export const getAnswers = payload =>
  request({
    url: `${baseUrl}/answers/getAnswers`
  });

export const uploadAnswer = payload =>
  request({
    url: `${baseUrl}/answers/uploadAnswer`,
    method: "post",
    data: payload
  });
