SELECT COUNT(*) FROM orders;

SELECT SUM(sales) FROM orders; 

SELECT SUM(profit) FROM orders;

SELECT SUM(sales) / COUNT(DISTINCT order_id) FROM orders;

SELECT * FROM orders;  

-- Ship Mode Count
SELECT ship_mode,COUNT(*)
FROM orders
GROUP BY ship_mode
ORDER BY COUNT(*) DESC;



-- High Value Customers
SELECT customer_name
FROM orders
GROUP BY order_id,customer_name
ORDER BY SUM(sales) DESC
LIMIT 5;

-- Revenue by segment
SELECT segment,SUM(sales) 
FROM orders
GROUP BY segment;

-- Revenue by region
SELECT region,SUM(sales) 
FROM orders
GROUP BY region;

SELECT MONTHNAME(order_date) AS "month", SUM(sales) AS "Total_Revenue"
FROM orders
-- WHERE YEAR(order_date) = 2017
GROUP BY month
ORDER BY Total_Revenue DESC;

SELECT * FROM returns;

-- Que 1
SELECT 
    p.person AS Manager,
    o.region,
    COUNT(DISTINCT o.order_id) AS Total_Orders,
    COUNT(DISTINCT r.order_id) AS Returned_Orders,
    -- Rate Calculation
    ROUND(
        (COUNT(DISTINCT r.order_id) / COUNT(DISTINCT o.order_id)) * 100, 
    2) AS Return_Rate_Percentage
FROM orders o
LEFT JOIN returns r ON o.order_id = r.order_id
JOIN people p ON o.region = p.region
GROUP BY p.person, o.region
ORDER BY Return_Rate_Percentage DESC;


-- Que 2
SELECT * FROM ( 
  SELECT *,
  DENSE_RANK() OVER(PARTITION BY state ORDER BY total_sales DESC) "rn"
  FROM ( 
  SELECT customer_id,customer_name,state,SUM(sales) "total_sales"
FROM orders
GROUP BY customer_id,customer_name,state
  ) t
) ranked
WHERE rn < 6;

-- Que 3
SELECT 
    ship_mode,
    ROUND(AVG(days_taken), 2) AS Avg_Shipping_Days,
    ROUND(
        (SUM(is_late) / COUNT(*)) * 100, 
    2) AS Late_Percentage
FROM ( 
    SELECT 
        order_id,
        ship_mode,
        DATEDIFF(ship_date, order_date) AS days_taken,
        CASE 
            WHEN ship_mode = 'Same Day' AND DATEDIFF(ship_date, order_date) > 0 THEN 1
            WHEN ship_mode = 'First Class' AND DATEDIFF(ship_date, order_date) > 2 THEN 1
            WHEN ship_mode = 'Second Class' AND DATEDIFF(ship_date, order_date) > 4 THEN 1
            WHEN ship_mode = 'Standard Class' AND DATEDIFF(ship_date, order_date) > 6 THEN 1
            ELSE 0 
        END AS is_late
    FROM orders
) t
GROUP BY ship_mode
ORDER BY Late_Percentage DESC;

-- Que 4 
SELECT 
    order_year_month,
    monthly_sales,
    prev_month_sales,
    ROUND(((monthly_sales - prev_month_sales) / prev_month_sales) * 100, 2) AS growth_percentage
FROM (
    SELECT 
        order_year_month,
        monthly_sales,
        LAG(monthly_sales) OVER (ORDER BY order_year_month) AS prev_month_sales
    FROM (
        SELECT 
            DATE_FORMAT(order_date, '%Y-%m') AS order_year_month,
            SUM(sales) AS monthly_sales
        FROM orders
        WHERE category = 'Furniture'
        GROUP BY DATE_FORMAT(order_date, '%Y-%m')
    ) t1
) t2;

-- Que 5 
-- My Approach
SELECT *,
  (ABS(loss_value) / ABS(summed_lv)) * 100 AS "loss_p"
  FROM (
  SELECT *,
 SUM(loss_value) OVER() AS "summed_lv"
  FROM (
  SELECT product_name,SUM(loss) AS "loss_value", SUM(profit_value) AS "profit_value"
  FROM (  
    SELECT *,
    CASE WHEN profit < 0 THEN profit ELSE 0 END AS "loss",
    CASE WHEN profit > 0 THEN profit ELSE 0 END AS "profit_value"
    FROM orders
    ) t
  GROUP BY product_name
) t1
) final
WHERE loss_value < 0
ORDER BY loss_p DESC;

-- Total Profit & Loss & Loss pct

WITH Profit_Loss_Table AS (
    SELECT 
        order_id,
        CASE WHEN profit < 0 THEN profit ELSE 0 END as loss_amt,
        CASE WHEN profit > 0 THEN profit ELSE 0 END as profit_amt
    FROM orders
)

SELECT 
    SUM(profit_amt) as Total_Gross_Profit,
    ABS(SUM(loss_amt)) as Total_Lost_Money,
    ROUND(
        (ABS(SUM(loss_amt)) / SUM(profit_amt)) * 100, 
    2) as Loss_Percentage_Impact
FROM Profit_Loss_Table;
