import { request } from "../utils";
const baseUrl = "/api/fuye1000/uploadAnswer";

export const getAnswerList = payload => request(`${baseUrl}/`);
// export const uploadAnswer = payload => request(`${baseUrl}/`);
