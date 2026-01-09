from filters import build_where_clause


def get_total_sales(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT SUM(sales) AS total_sales
        FROM orders
        {where_clause}
    """

    cursor.execute(query, values)
    result = cursor.fetchone()
    return result["total_sales"] or 0


def get_total_profit(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT SUM(profit) AS total_profit
        FROM orders
        {where_clause}
    """

    cursor.execute(query, values)
    result = cursor.fetchone()
    return result["total_profit"] or 0


def get_profit_margin(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT (SUM(profit) / SUM(sales)) * 100 AS profit_margin
        FROM orders
        {where_clause}
    """

    cursor.execute(query, values)
    result = cursor.fetchone()
    return result["profit_margin"] or 0


def get_total_orders(cursor, year=None, region=None,category=None):
    where_clause, values = build_where_clause(year, region,category)

    query = f"""
        SELECT COUNT(DISTINCT order_id) AS total_orders
        FROM orders
        {where_clause}
    """

    cursor.execute(query, values)
    result = cursor.fetchone()
    return result["total_orders"] or 0
