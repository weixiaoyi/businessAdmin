import { request } from "../utils";
const baseUrl = "/fuye1000/api";

export const getAnswers = payload =>
  request({
    url: `${baseUrl}/answers`
  });
