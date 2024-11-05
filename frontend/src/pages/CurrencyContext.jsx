// src/context/CurrencyContext.js
import React, { useState, createContext, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('selectedCurrency') || 'EGP');
  const [conversionRate, setConversionRate] = useState(parseFloat(localStorage.getItem('conversionRate')) || 1);

  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
    localStorage.setItem('conversionRate', conversionRate);
  }, [selectedCurrency, conversionRate]);

  const fetchConversionRate = async (currency) => {
    try {
      const response = await fetch(`http://localhost:8000/getCurrencyRates?currency=${currency}`);
      const data = await response.json();
      setConversionRate(data.rate);
      setSelectedCurrency(currency);
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, conversionRate, setSelectedCurrency, fetchConversionRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};
