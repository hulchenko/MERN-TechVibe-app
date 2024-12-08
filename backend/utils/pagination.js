export const paginationParams = (req) => {
  return {
    pageSize: 10,
    page: Number(req.query.pageNum) || 1,
  };
};
