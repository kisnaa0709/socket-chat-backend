exports.search = (filter, pagination, sort) => {
  return [
    {
      $match: filter,
    },
    {
      $facet: {
        data: [
          {
            $sort: sort,
          },
          {
            $skip: pagination.skip,
          },
          {
            $limit: pagination.limit,
          },
        ],
        count: [
          {
            $count: "count",
          },
        ],
      },
    },
  ];
}; 