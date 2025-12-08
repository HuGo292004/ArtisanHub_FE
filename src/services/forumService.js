import axiosClient from "./axiosClient";

// ============ FORUM TOPICS ============
/**
 * Lấy tất cả Forum Topics
 * GET /api/v1/ForumTopic
 */
export const getAllForumTopics = async () => {
  const response = await axiosClient.get("/api/v1/ForumTopic");
  return response;
};

/**
 * Lấy chi tiết một Forum Topic
 * GET /api/v1/ForumTopic/{id}
 */
export const getForumTopicById = async (topicId) => {
  const response = await axiosClient.get(`/api/v1/ForumTopic/${topicId}`);
  return response;
};

// ============ FORUM THREADS ============
/**
 * Lấy tất cả Threads trong một Topic
 * GET /api/v1/forum-threads/by-topic/{topicId}
 */
export const getThreadsByTopicId = async (topicId) => {
  const response = await axiosClient.get(
    `/api/v1/forum-threads/by-topic/${topicId}`
  );
  return response;
};

/**
 * Lấy tất cả Threads
 * GET /api/v1/forum-threads
 */
export const getAllThreads = async () => {
  const response = await axiosClient.get("/api/v1/forum-threads");
  return response;
};

/**
 * Lấy chi tiết một Thread (bao gồm các Posts)
 * GET /api/v1/forum-threads/{threadId}
 */
export const getThreadById = async (threadId) => {
  const response = await axiosClient.get(`/api/v1/forum-threads/${threadId}`);
  return response;
};

/**
 * Tạo Thread mới
 * POST /api/v1/forum-threads
 * Sử dụng multipart/form-data
 */
export const createThread = async (threadData) => {
  // threadData: { forumTopicId, title, content, imageFile? }
  const formData = new FormData();
  formData.append("Title", threadData.title);
  formData.append("InitialPostContent", threadData.content);
  formData.append("ForumTopicId", threadData.forumTopicId);

  if (threadData.imageFile) {
    formData.append("ImageFile", threadData.imageFile);
  }

  const response = await axiosClient.post("/api/v1/forum-threads", formData);
  return response;
};

// ============ FORUM POSTS ============
/**
 * Lấy tất cả Posts trong một Thread
 * GET /api/v1/forum-posts?threadId={threadId}
 */
export const getPostsByThreadId = async (threadId) => {
  const response = await axiosClient.get(
    `/api/v1/forum-posts?threadId=${threadId}`
  );
  return response;
};

/**
 * Tạo Post mới trong Thread
 * POST /api/v1/forum-posts
 */
export const createPost = async (postData) => {
  // postData: { forumThreadId, content }
  const response = await axiosClient.post("/api/v1/forum-posts", postData);
  return response;
};

/**
 * Lấy chi tiết một Post
 * GET /api/v1/forum-posts/{postId}
 */
export const getPostById = async (postId) => {
  const response = await axiosClient.get(`/api/v1/forum-posts/${postId}`);
  return response;
};

/**
 * Xóa một Post
 * DELETE /api/v1/forum-posts/{postId}
 */
export const deletePost = async (postId) => {
  const response = await axiosClient.delete(`/api/v1/forum-posts/${postId}`);
  return response;
};

/**
 * Cập nhật Thread
 * PUT /api/v1/forum-threads/{threadId}
 */
export const updateThread = async (threadId, threadData) => {
  const response = await axiosClient.put(
    `/api/v1/forum-threads/${threadId}`,
    threadData
  );
  return response;
};

/**
 * Xóa Thread
 * DELETE /api/v1/forum-threads/{threadId}
 */
export const deleteThread = async (threadId) => {
  const response = await axiosClient.delete(
    `/api/v1/forum-threads/${threadId}`
  );
  return response;
};

export default {
  getAllForumTopics,
  getForumTopicById,
  getThreadsByTopicId,
  getAllThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  getPostsByThreadId,
  createPost,
  getPostById,
  deletePost,
};
