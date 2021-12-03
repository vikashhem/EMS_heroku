exports.updateToken = async (model, id, token) => {
  await model.findByIdAndUpdate(
    id,
    {
      token,
    },
    {
      new: true,
      runvalidators: true,
    }
  );
};
