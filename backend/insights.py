def get_return_rate_by_manager(cursor):
    """
    Fetches return rate data by manager and region
    Returns: List of dictionaries containing manager, region, total orders, returned orders, and return rate
    """
    query = """
    SELECT 
        p.person AS Manager,
        o.region,
        COUNT(DISTINCT o.order_id) AS Total_Orders,
        COUNT(DISTINCT r.order_id) AS Returned_Orders,
        ROUND(
            (COUNT(DISTINCT r.order_id) / COUNT(DISTINCT o.order_id)) * 100, 
        2) AS Return_Rate_Percentage
    FROM orders o
    LEFT JOIN returns r ON o.order_id = r.order_id
    JOIN people p ON o.region = p.region
    GROUP BY p.person, o.region
    ORDER BY Return_Rate_Percentage DESC
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    return results


def get_top_customers_by_state(cursor, state):
    """
    Fetches top 5 customers by sales for a specific state
    Args:
        cursor: Database cursor
        state: State filter (required)
    Returns: List of dictionaries containing customer details and sales by state
    """
    query = """
    SELECT * FROM ( 
        SELECT *,
        DENSE_RANK() OVER(PARTITION BY state ORDER BY total_sales DESC) AS rn
        FROM ( 
            SELECT customer_id, customer_name, state, SUM(sales) AS total_sales
            FROM orders
            WHERE state = %s
            GROUP BY customer_id, customer_name, state
        ) t
    ) ranked
    WHERE rn < 6
    """
    cursor.execute(query, (state,))
    results = cursor.fetchall()
    return results


def get_all_states(cursor):
    """
    Fetches all unique states from orders
    Returns: List of unique state names
    """
    query = """
    SELECT DISTINCT state
    FROM orders
    ORDER BY state
    """
    cursor.execute(query)
    results = cursor.fetchall()
    return results


def get_shipping_performance(cursor):
    """
    Fetches shipping performance metrics by ship mode
    Returns: List of dictionaries containing ship mode, avg shipping days, and late percentage
    """
    query = """
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
    ORDER BY Late_Percentage DESC
    """
    cursor.execute(query)
    results = cursor.fetchall()
    return results


def get_mom_growth(cursor, year=None):
    """
    Fetches month-over-month growth data
    Args:
        cursor: Database cursor
        year: Optional year filter (defaults to latest year if not provided)
    Returns: List of dictionaries containing order_year_month, monthly_sales, prev_month_sales, growth_percentage
    """
    # If year is not provided, get the latest year
    if year is None:
        cursor.execute("SELECT MAX(YEAR(order_date)) FROM orders")
        year = cursor.fetchone()[0]
    
    query = """
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
                WHERE YEAR(order_date) = %s
                GROUP BY DATE_FORMAT(order_date, '%Y-%m')
            ) t1
        ) t2
    """
    
    cursor.execute(query, (year,))
    results = cursor.fetchall()
    return results


def get_available_years(cursor):
    """
    Fetches all available years from orders
    Returns: List of unique years ordered from most recent to oldest
    """
    query = """
        SELECT DISTINCT YEAR(order_date) AS year
        FROM orders
        ORDER BY year DESC
    """
    cursor.execute(query)
    results = cursor.fetchall()
    return results


def get_profit_loss_analysis(cursor):
    """
    Calculates profit vs loss analysis from orders
    Returns: Dictionary containing total gross profit, total lost money, and percentage impacts
    """
    query = """
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
            (ABS(SUM(loss_amt)) / (SUM(profit_amt) + ABS(SUM(loss_amt)))) * 100, 2
        ) as Loss_Percentage_Impact,
        ROUND(
            (SUM(profit_amt) / (SUM(profit_amt) + ABS(SUM(loss_amt)))) * 100, 2
        ) as Profit_Percentage_Impact
    FROM Profit_Loss_Table
    """
    cursor.execute(query)
    result = cursor.fetchone()
    return result


def get_top_loss_products(cursor):
    """
    Fetches top 5 products that contribute most to the total loss
    Returns: List of products with their loss contribution percentage
    """
    query = """
    WITH t1 AS ( 
        SELECT *,
               CASE WHEN profit < 0 THEN profit ELSE 0 END AS loss_amt
        FROM orders
    ),
    t2 AS ( 
        SELECT 
            product_name,
            ABS(SUM(loss_amt)) AS loss_amt
        FROM t1
        WHERE loss_amt < 0
        GROUP BY product_name
        ORDER BY loss_amt DESC
    ),
    t3 AS (
        SELECT *,
        SUM(loss_amt) OVER() as total_loss_amt
        FROM t2
    )
    SELECT 
        product_name,
        ROUND((loss_amt / total_loss_amt) * 100, 2) AS loss_pct
    FROM t3
    LIMIT 5
    """
    cursor.execute(query)
    results = cursor.fetchall()
    return results


def get_top_profit_products(cursor):
    """
    Fetches top 5 products that contribute most to the total profit
    Returns: List of products with their profit contribution percentage
    """
    query = """
    WITH t1 AS ( 
        SELECT *,
               CASE WHEN profit > 0 THEN profit ELSE 0 END AS profit_amt
        FROM orders
    ),
    t2 AS ( 
        SELECT 
            product_name,
            SUM(profit_amt) AS profit_amt
        FROM t1
        WHERE profit_amt > 0
        GROUP BY product_name
        ORDER BY profit_amt DESC
    ),
    t3 AS (
        SELECT *,
        SUM(profit_amt) OVER() as total_profit_amt
        FROM t2
    )
    SELECT 
        product_name,
        ROUND((profit_amt / total_profit_amt) * 100, 2) AS profit_pct
    FROM t3
    LIMIT 5
    """
    cursor.execute(query)
    results = cursor.fetchall()
    return results
