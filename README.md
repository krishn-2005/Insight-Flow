**InsightFlow** is an interactive ecommerce analytics dashboard built to analyze sales, returns, shipping performance, and profitability.

Unlike static reports, this application allows users to **explore key metrics, identify business problems, and understand the reasons behind them**.

The project focuses on **decision-making**, not just visualization.

---

## 📊 Key Business Insights Covered

- **Return Rate Analysis**  
  Identifies regions and managers with unusually high product return rates.

- **Top Customers by State**  
  Highlights top revenue-contributing customers using ranking logic.

- **Shipping Performance Analysis**  
  Measures average delivery time and late delivery percentage by shipping mode.

- **Month-over-Month Growth Trends**  
  Detects seasonal and monthly sales patterns across years.

- **Profit vs Loss & Pareto Analysis**  
  Shows how a small set of products contributes to the majority of losses and profits.

---

## 🧠 Core SQL Logic

The analytical foundation of this project is built using advanced SQL concepts:
- Joins & Conditional Aggregation
- Window Functions (Ranking, Running Totals)
- CTEs for step-by-step business logic
- Date-based analysis for trends and performance tracking

Each query is designed to answer a **real business question**.

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React |
| Backend | FastAPI (Python) |
| Database | SQL |

---

## 🎯 Key Features

- Interactive dashboard with drill-down insights
- Flip-card views showing insight summaries and recommended actions
- Profit vs Loss toggle for product-level analysis
- Data-driven visual cues (alerts, growth indicators)

---

## ⚙️ How to Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```
