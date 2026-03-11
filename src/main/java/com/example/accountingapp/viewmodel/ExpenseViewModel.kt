package com.example.accountingapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.example.accountingapp.data.AppDatabase
import com.example.accountingapp.data.Expense
import com.example.accountingapp.data.ExpenseDao
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ExpenseViewModel(application: Application) : AndroidViewModel(application) {
    private val expenseDao: ExpenseDao = AppDatabase.getDatabase(application).expenseDao()

    fun insertExpense(expense: Expense) {
        viewModelScope.launch(Dispatchers.IO) {
            expenseDao.insert(expense)
        }
    }

    fun getExpensesByDateRange(startDate: java.util.Date, endDate: java.util.Date): LiveData<List<Expense>> {
        return expenseDao.getExpensesByDateRange(startDate, endDate)
    }
}