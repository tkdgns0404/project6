module.exports = {
  secret:
    process.env.NODE_ENV === "production" ? process.env.SECRET : "backend!@",
  db: {
    user: "project6",
    password: "project6",
    connectSttring: "192.168.1.2/orcl",
  },
};
