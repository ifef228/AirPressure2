// Мок данные для заказа с бэкенда
export interface OrderGasItem {
  id: number;
  name: string;
  concentration: number; // в процентах
  temperature: number; // в градусах Цельсия
  price: number; // цена за 1 м³ воздуха с данной концентрацией
  image: string;
}

export const mockOrderData: OrderGasItem[] = [
  {
    id: 1,
    name: "CO₂ (Углекислый газ)",
    concentration: 0.04,
    temperature: 15,
    price: 2500,
    image: "http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9jbzIucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9TUZFRVlJMkc3M1hPOTJFMDlWNkElMkYyMDI1MDkyNyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MjdUMTMzOTExWiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTlJrVkZXVWt5UnpjeldFODVNa1V3T1ZZMlFTSXNJbVY0Y0NJNk1UYzFPVEF5TXpJNU5Dd2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLlNUVWJjallJMkR1ZVJLUWV5VUNRX1JZYkRmMnhkX1pLUkE1dExCdFZDOTVOU1FxWWVsbkdXejFqWEFhS3A3ZVM5TGV1Um9oYVNaeHdzZUVsdkNLRUlBJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9NTM0MmY4MzE0MTM1YjRkNGIzY2M2ZDg4M2E1ZWMwMTQxMTUzZGQzZDMxMDY2ODZmZTE3MThlOTA2ZjQ2NDliYw"
  },
  {
    id: 2,
    name: "O₂ (Кислород)",
    concentration: 20.95,
    temperature: 15,
    price: 1800,
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-12.png"
  },
  {
    id: 3,
    name: "Ar (Аргон)",
    concentration: 0.93,
    temperature: 15,
    price: 3200,
    image: "http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9hci5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1NRkVFWUkyRzczWE85MkUwOVY2QSUyRjIwMjUwOTI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkyN1QxMzM4NDNaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpOUmtWRldVa3lSemN6V0U4NU1rVXdPVlkyUVNJc0ltVjRjQ0k2TVRjMU9UQXlNekk1TkN3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuU1RVYmNqWUkyRHVlUktRZXlVQ1FfUlliRGYyeGRfWktSQTV0TEJ0VkM5NU5TUXFZZWxuR1d6MWpYQWFLcDdlUzlMZXVSb2hhU1p4d3NlRWx2Q0tFSUEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT0xMGE0NDRmNTZlM2RjODhjYmNjYjhjNzM0ODI0YjQwNDIyZTI1MTZjNTNmOWYzMTUwZjcxMmU4ODAzNzU2NDJm"
  },
  {
    id: 4,
    name: "N₂ (Азот)",
    concentration: 78.08,
    temperature: 15,
    price: 1200,
    image: "http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9vMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1NRkVFWUkyRzczWE85MkUwOVY2QSUyRjIwMjUwOTI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkyN1QxMzQzNDhaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpOUmtWRldVa3lSemN6V0U4NU1rVXdPVlkyUVNJc0ltVjRjQ0k2TVRjMU9UQXlNekk1TkN3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuU1RVYmNqWUkyRHVlUktRZXlVQ1FfUlliRGYyeGRfWktSQTV0TEJ0VkM5NU5TUXFZZWxuR1d6MWpYQWFLcDdlUzlMZXVSb2hhU1p4d3NlRWx2Q0tFSUEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT1hNTUwMGI2YzZjZWI0Mzk3ZDlhN2IyYjU4ZjFjOWIzMDUzY2IyYzM5MjJhMWFhZWVkZWNjOGE1MTc0MjNhM2E5"
  },
  {
    id: 5,
    name: "H₂O (Водяной пар)",
    concentration: 2.5,
    temperature: 15,
    price: 800,
    image: "http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9oMm8ucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9TUZFRVlJMkc3M1hPOTJFMDlWNkElMkYyMDI1MDkyNyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MjdUMTMzOTI4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTlJrVkZXVWt5UnpjeldFODVNa1V3T1ZZMlFTSXNJbVY0Y0NJNk1UYzFPVEF5TXpJNU5Dd2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLlNUVWJjallJMkR1ZVJLUWV5VUNRX1JZYkRmMnhkX1pLUkE1dExCdFZDOTVOU1FxWWVsbkdXejFqWEFhS3A3ZVM5TGV1Um9oYVNaeHdzZUVsdkNLRUlBJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MWE1YzBhYTlkMTZkMzBjZWFlMDI1MDQ2N2IzOTgyYTBmZTgxZWE5M2QwMTlmNGY1NTg1NmUzZmRjNzE3OTUzYw"
  }
];

// Данные о температурных диапазонах для газов (в газообразном состоянии)
export const gasTemperatureRanges = {
  1: { min: -78.5, max: 2000 }, // CO2: от сублимации до высоких температур
  2: { min: -183, max: 2000 },  // O2: от кипения до высоких температур
  3: { min: -185.8, max: 2000 }, // Ar: от кипения до высоких температур
  4: { min: -195.8, max: 2000 }, // N2: от кипения до высоких температур
  5: { min: 0, max: 100 }        // H2O: от замерзания до кипения
};
