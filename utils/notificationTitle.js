const NotificationTitle = (title, type, message) => {
  return {
    notification: {
      title: `${title}`,
      body: `${message}`,
    },
    data: {
      type: `${type}`,
    },
  };
};

module.exports = NotificationTitle;
