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
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    
    // Panggil service dengan parameter page dan limit
    const result = await transactionService.getAllTransactions(page || 1, limit || 10);
    
    res.status(200).json({
      message: 'All transactions fetched successfully',
      data: result.data,
      meta: result.meta // Sertakan meta data pagination
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

export const exportTransactions = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Ambil data yang sudah diformat dari service
    const data = await transactionService.exportTransactions(startDate, endDate);

    if (data.length === 0) {
      const error = new Error('No transactions found for the selected period');
      error.status = 404;
      throw error;
    }

    // Definisikan field/kolom CSV
    const fields = [
      'Transaction ID', 'Date', 'Time', 'Cashier', 
      'Product Name', 'Quantity', 'Price', 'Total Item Price', 'Total Transaction'
    ];

    // Convert JSON ke CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    // Set Header agar browser menganggap ini file download
    res.header('Content-Type', 'text/csv');
    res.attachment(`transactions-${Date.now()}.csv`); // Nama file otomatis
    
    // Kirim CSV
    return res.send(csv);

  } catch (error) {
    next(error);
  }
};