from filters import build_where_clause


def get_revenue_by_month(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT
            YEAR(order_date) AS year,
            MONTH(order_date) AS month,
            SUM(sales) AS total_sales
        FROM orders
        {where_clause}
        GROUP BY year, month
        ORDER BY year, month
    """

    cursor.execute(query, values)
    rows = cursor.fetchall()

    data = []
    for r in rows:
        data.append({
            "period": f"{r['year']}-{str(r['month']).zfill(2)}",
            "revenue": r["total_sales"]
        })

    return data


def get_sales_by_category(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT
            category,
            SUM(sales) AS total_sales
        FROM orders
        {where_clause}
        GROUP BY category
        ORDER BY total_sales DESC
    """

    cursor.execute(query, values)
    rows = cursor.fetchall()

    data = []
    for r in rows:
        data.append({
            "name": r["category"],
            "value": r["total_sales"]
        })

    return data


def get_top_states_by_revenue(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT
            state,
            SUM(sales) AS revenue
        FROM orders
        {where_clause}
        GROUP BY state
        ORDER BY revenue DESC
        LIMIT 5
    """

    cursor.execute(query, values)
    return cursor.fetchall()
