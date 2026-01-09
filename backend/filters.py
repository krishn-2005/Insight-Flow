def build_where_clause(year=None, region=None, category=None):
    conditions = []
    values = []

    if year:
        conditions.append("YEAR(order_date) = %s")
        values.append(year)

    if region:
        conditions.append("region = %s")
        values.append(region)

    if category:
        conditions.append("category = %s")
        values.append(category)

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    return where_clause, values
