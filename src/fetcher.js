const axios = require("axios");
const fs = require("fs");
const qs = require("qs");

axios.interceptors.request.use((config) => {
  fs.writeFileSync(`${path}/req.txt`, JSON.stringify(config));
  return config;
});

axios.interceptors.response.use((res) => {
  fs.writeFileSync(
    `${path}/res.txt`,
    JSON.stringify({
      status: res.status,
      header: res.headers,
      data: res.data,
    })
  );
  return res;
});

// inject here
