export const PERMISSIONS = {
  USER: {
    CREATE: "101",
    READ: "102",
    UPDATE: "103",
    DELETE: "104",
  },
  TEAM: {
    CREATE: "111",
    READ: "112",
    UPDATE: "113",
    DELETE: "114",
  },
  ROLE: {
    CREATE: "201",
    READ: "202",
    UPDATE: "203",
    DELETE: "204",
  },
  PROJECT: {
    CREATE: "301",
    READ: "302",
    UPDATE: "303",
    DELETE: "304",
  },
  TASK: {
    CREATE: "401",
    READ: "402",
    UPDATE: "403",
    DELETE: "404",
  },
};

export const ROLE_PERMISSIONS = {
  MANAGER: [...Object.values(PERMISSIONS.TEAM)],
  MEMBER: [
    ...Object.values(PERMISSIONS.TEAM),
    ...Object.values(PERMISSIONS.PROJECT),
  ],
};
