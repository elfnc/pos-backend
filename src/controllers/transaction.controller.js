import * as transactionService from '../services/transaction.service.js';

export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transaction = await transactionService.createTransaction(req.body, userId);
    res.status(201).json({
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Insufficient')) {
        error.status = 400;
    }
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json({
      message: 'All transactions fetched successfully',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    res.status(200).json({
      message: 'Transaction details fetched successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};