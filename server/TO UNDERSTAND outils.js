const sendResponse = (res, status, data, message = "No message included.") => {
  return res.status(status).json({ status, data, message });
};

const findAccount = (accounts, accountId) => {
  const foundAccount = accounts.find((account) => account.id === accountId);
  return foundAccount ? (foundAccount.deleted ? null : foundAccount) : null;
};

const findAccountIndex = (accounts, accountId) => {
  const index = accounts.findIndex((account) => account.id === accountId);
  return index !== -1 ? index : null;
};

const findAccountName = (accounts, accountName) => {
  const foundAccount = accounts.find((account) => account.name === accountName);
  return foundAccount ? (foundAccount.deleted ? null : foundAccount) : null;
};

module.exports = {
  findAccount,
  findAccountIndex,
  sendResponse,
  findAccountName,
};
