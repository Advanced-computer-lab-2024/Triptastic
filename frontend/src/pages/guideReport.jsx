import React, { useState, useEffect, useContext } from 'react';
const guideReport = () => {

  return (
    <div>
      <h1>{localStorage.getItem('Username')}'s sales report</h1>
    </div>
  );
}
export default guideReport;