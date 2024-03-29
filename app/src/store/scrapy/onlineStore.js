import { autorun, computed, observable } from "mobx";
import ModelExtend from "../modelExtend";
import { notification, message } from "antd";
import {
  getAnswers,
  getOnlineDbs,
  onlineAnswerDb,
  offlineAnswerDb,
  deleteLineDb,
  updateLineDb,
  getUsers,
  operationUserBlackList,
  getBlackUsers,
  operationWebsiteConfig,
  getWebsiteConfig,
  getIdeasPreview,
  getIdeaDetail,
  inspectIdea,
  inspectIdeaComment,
  inspectAnswerComment,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  getSensitiveWord,
  addSensitiveWord,
  updateSensitiveWord,
  deleteSensitiveWord,
  getIdeasComments,
  getAnswerComment,
  deleteLineAnswer,
  recommendLineAnswer
} from "../../services";
import { db, Domain } from "../../constants";

export default class OnlineStore extends ModelExtend {
  constructor(rootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }
  @observable websiteConfig = {};

  @observable onlineAnswers = [];
  @observable pagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable localDbs = db.scrapy;
  @observable dbPagination = {
    pageSize: 100,
    current: 1,
    total: 0
  };

  @observable users = [];
  @observable userPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable blackUsers = [];
  @observable blackUsersPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable ideasPreview = [];
  @observable ideasPreviewPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable ideasComment = [];
  @observable ideasCommentPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable answerComment = [];
  @observable answerCommentPagination = {
    pageSize: 20,
    current: 1,
    total: 0
  };

  @observable groups = [];
  @observable sensitiveWords = [];

  @observable ideaDetail = {};

  getOnlineDbs = async payload => {
    const res = await getOnlineDbs({
      page: this.dbPagination.current,
      pageSize: this.dbPagination.pageSize,
      ...(payload && payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload && payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit(
        "localDbs",
        this.localDbs.map(item => {
          const findOne = res.data.find(one => one.name === item.name) || {};
          return {
            ...item,
            online: findOne.online ? findOne.online : "waiting",
            onlineData: findOne
          };
        })
      );
    }
  };

  getAnswers = async payload => {
    const res = await getAnswers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      dbName: this.rootStore.scrapyStore.dbName
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        onlineAnswers: res.data,
        pagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  deleteLineAnswer = async payload => {
    const res = await deleteLineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("删除线上answer成功");
      this.dispatch({
        type: "getAnswers"
      });
    }
  };

  recommendLineAnswer = async payload => {
    const res = await recommendLineAnswer(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("推荐指数成功");
      this.dispatch({
        type: "getAnswers"
      });
    }
  };

  onlineDb = async payload => {
    const res = await onlineAnswerDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("上线成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  updateLineDb = async payload => {
    const res = await updateLineDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("更新成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  offlineDb = async payload => {
    const res = await offlineAnswerDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("下线成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  deleteLineDb = async payload => {
    const res = await deleteLineDb(payload).catch(this.handleError);
    if (res && res.data) {
      message.success("线上数据库删除成功");
      this.dispatch({
        type: "getOnlineDbs"
      });
    }
  };

  getUsers = async payload => {
    const res = await getUsers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      ...(payload.id ? { id: payload.id } : {}),
      ...(payload.name ? { name: payload.name } : {}),
      domain: "fuye"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        users: res.data,
        userPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getBlackUsers = async payload => {
    const res = await getBlackUsers({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {}),
      domain: "fuye"
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        blackUsers: res.data,
        blackUsersPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getIdeasPreview = async payload => {
    const res = await getIdeasPreview({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {})
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideasPreview: res.data,
        ideasPreviewPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getIdeaDetail = async payload => {
    const { id } = payload;
    const res = await getIdeaDetail({
      id
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideaDetail: res.data
      });
    }
  };

  getIdeasComment = async payload => {
    const res = await getIdeasComments({
      page: this.ideasCommentPagination.current,
      pageSize: this.ideasCommentPagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {})
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        ideasComment: res.data,
        ideasCommentPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  getAnswerComment = async payload => {
    const res = await getAnswerComment({
      page: this.ideasCommentPagination.current,
      pageSize: this.ideasCommentPagination.pageSize,
      ...(payload.pageSize ? { pageSize: payload.pageSize } : {}),
      ...(payload.page ? { page: payload.page } : {})
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        answerComment: res.data,
        answerCommentPagination: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total
        }
      });
    }
  };

  inspectIdea = async payload => {
    const { id, online, denyWhy } = payload;
    const res = await inspectIdea({
      id,
      online,
      denyWhy
    }).catch(this.handleError);
    if (res && res.data) {
      message.success("审核成功");
      this.dispatch({
        type: "getIdeasPreview"
      });
    }
  };

  inspectIdeaComment = async payload => {
    const { id, online } = payload;
    const res = await inspectIdeaComment({
      id,
      online
    }).catch(this.handleError);
    if (res && res.data) {
      message.success("审核成功");
      this.dispatch({
        type: "getIdeasComment"
      });
    }
  };

  inspectAnswerComment = async payload => {
    const { id, online } = payload;
    const res = await inspectAnswerComment({
      id,
      online
    }).catch(this.handleError);
    if (res && res.data) {
      message.success("审核成功");
      this.dispatch({
        type: "getAnswerComment"
      });
    }
  };

  operationUserBlackList = async payload => {
    const { type } = payload;
    const res = await operationUserBlackList(payload).catch(this.handleError);
    if (res && res.data) {
      message.success(
        type === "inspecting"
          ? "设置考察成功"
          : type === "forbidden"
          ? "禁言成功"
          : type === "normal"
          ? "恢复成功"
          : null
      );
      this.dispatch({
        type: "getUsers"
      });
      this.dispatch({
        type: "getBlackUsers"
      });
    }
  };

  getWebsiteConfig = async () => {
    const res = await getWebsiteConfig({
      domain: Domain.fuye.value
    }).catch(this.handleError);
    if (res && res.data) {
      this.commit({
        websiteConfig: res.data
      });
      return res.data;
    }
  };

  operationWebsiteConfig = async payload => {
    const { domain, detail } = payload;
    const res = await operationWebsiteConfig({
      domain,
      detail
    }).catch(this.handleError);
    if (res && res.data) {
      message.success("配置成功");
      this.dispatch({
        type: "getWebsiteConfig"
      });
    }
  };

  getGroups = async () => {
    const res = await getGroups().catch(this.handleError);
    if (res && res.code && res.data) {
      this.commit("groups", res.data);
    }
  };

  operationGroup = async payload => {
    const { action } = payload;
    let res;
    if (action === "add") {
      const { index, type, title, desc, avatar } = payload;
      res = await addGroup({
        index,
        type,
        title,
        desc,
        avatar
      }).catch(this.handleError);
    } else if (action === "edit") {
      const { id, index, type, title, desc, avatar } = payload;
      res = await updateGroup({
        id,
        index,
        type,
        title,
        desc,
        avatar
      }).catch(this.handleError);
    } else if (action === "delete") {
      const { id } = payload;
      res = await deleteGroup({
        id
      }).catch(this.handleError);
    }
    if (res && res.code && res.data) {
      message.success(
        action === "add"
          ? "添加圈子成功"
          : action === "edit"
          ? "更新圈子成功"
          : "删除圈子成功"
      );
      this.closeModal();
      this.dispatch({
        type: "getGroups"
      });
    }
  };

  getSensitiveWord = async () => {
    const res = await getSensitiveWord().catch(this.handleError);
    if (res && res.code && res.data) {
      this.commit("sensitiveWords", res.data);
    }
  };

  operationSensitiveWord = async payload => {
    const { action } = payload;
    let res;
    if (action === "add") {
      const { word } = payload;
      res = await addSensitiveWord({
        word
      }).catch(this.handleError);
    } else if (action === "update") {
      const { id, word } = payload;
      res = await updateSensitiveWord({
        id,
        word
      }).catch(this.handleError);
    } else if (action === "delete") {
      const { id } = payload;
      res = await deleteSensitiveWord({
        id
      }).catch(this.handleError);
    }
    if (res && res.code && res.data) {
      message.success(
        action === "add"
          ? "添加敏感词成功"
          : action === "edit"
          ? "更新敏感词成功"
          : "删除敏感词成功"
      );
      this.closeModal();
      this.dispatch({
        type: "getSensitiveWord"
      });
    }
  };
}
