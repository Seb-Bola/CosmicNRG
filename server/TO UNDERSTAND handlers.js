const {
  findAccount,
  findAccountIndex,
  sendResponse,
  findAccountName,
} = require("./utils");

const accounts = require("./data/accounts.json");

// GET all accounts
const getAccounts = (req, res) => {
  const activeAccounts = accounts.filter((account) => !account.deleted);
  sendResponse(res, 200, activeAccounts);
};

// GET account based on :id
const getAccountById = (req, res) => {
  const accountId = req.params.id;
  const account = findAccount(accounts, accountId);

  account
    ? sendResponse(res, 200, account)
    : sendResponse(res, 400, null, "Account not found.");
};

// POST login account by name
const loginAccount = (req, res) => {
  const { accountname } = req.body;

  const account = findAccountName(accounts, accountname);

  account
    ? sendResponse(res, 200, account)
    : sendResponse(res, 400, null, "Account not found.");
};

// We don't believe in actually deleting data...
// instead we add a 'deleted' flag to the object.
const deleteAccount = (req, res) => {
  const accountId = req.params.id;
  const index = findAccountIndex(accounts, accountId);
  if (!index) return sendResponse(res, 400, null, "Account not found.");

  accounts[index].deleted = true;
  sendResponse(res, 200, null, "Account deleted.");
};

// PATCH. requires the ids of 2 people to make them friends
// ids should be sent along as an array called newFriends in the body
const handleFriends = (req, res) => {
  const [accountId_1, accountId_2] = req.body.newFriends;
  const account_1 = findAccount(accounts, accountId_1);
  const account_2 = findAccount(accounts, accountId_2);

  // if either of the accountIds don't exist, stop and return error
  if (!account_1 || !account_2)
    return sendResponse(
      res,
      400,
      req.body,
      "One or both of the accounts not found."
    );

  const accountIdx_1 = findAccountIndex(accounts, accountId_1);
  const accountIdx_2 = findAccountIndex(accounts, accountId_2);

  // if accounts are already friends, make them NOT friends
  if (
    account_1.friends.includes(accountId_2) ||
    account_2.friends.includes(accountId_1)
  ) {
    accounts[accountIdx_1].friends.splice(
      account_1.friends.indexOf(accountId_2),
      1
    );
    accounts[accountIdx_2].friends.splice(
      account_2.friends.indexOf(accountId_1),
      1
    );

    return sendResponse(
      res,
      200,
      [account_1.friends, account_2.friends],
      "Accounts are no longer friends."
    );
  }

  accounts[accountIdx_1].friends.push(accountId_2);
  accounts[accountIdx_2].friends.push(accountId_1);

  sendResponse(
    res,
    200,
    [account_1.friends, account_2.friends],
    "Accounts are now friends."
  );
};

module.exports = {
  deleteAccount,
  getAccounts,
  getAccountById,
  handleFriends,
  loginAccount,
};
