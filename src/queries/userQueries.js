exports.search = (filter, pagination, sort) => {
    const baseQuery = [
      {
        $match: {
          ...filter,
        },
      },
    ];
  
    const dataQuery = [
      ...baseQuery,
      {
        $sort: {
          ...sort,
        },
      },
      {
        $skip: pagination?.skip || 0,
      },
      {
        $limit: pagination?.limit || 10,
      },
    ];
  
    const countQuery = [
      ...baseQuery,
      {
        $count: "count",
      },
    ];
  
    return [
      {
        $facet: {
          data: dataQuery,
          count: countQuery,
        },
      },
    ];
  };
  