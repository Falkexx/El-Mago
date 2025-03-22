require('dotenv/config');
const jwt = require('jsonwebtoken');

console.log(
  jwt.verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4Mzc1Yjg1ZC0yMmEwLTRhOWYtYWUwZS03ZjhjNDZiOTU3NzEiLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaXNCYW5uZWQiOmZhbHNlLCJpc0RlbGV0ZWQiOmZhbHNlLCJpYXQiOjE3MzgwNjkxNzEsImV4cCI6MTc2OTYyNjc3MX0.p8tT_tfz_pshHRBsF0gn8h18E6T4B4Brdx8-1j8-Rmc',
    process.env.JWT_SECRET,
  ),
);
