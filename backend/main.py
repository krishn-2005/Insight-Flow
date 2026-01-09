from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import get_db_connection
from cards import get_total_sales,get_total_profit,get_profit_margin,get_total_orders
from charts import (
    get_revenue_by_month,
    get_sales_by_category,
    get_top_states_by_revenue
)
from insights import get_return_rate_by_manager, get_top_customers_by_state, get_all_states, get_shipping_performance, get_mom_growth, get_available_years, get_profit_loss_analysis, get_top_loss_products, get_top_profit_products


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def mainpage(
    year: int | None = None,
    region: str | None = None,
    category: str | None = None
    ):
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    # cards
    total_sales = get_total_sales(cursor, year, region, category)
    total_profit = get_total_profit(cursor, year, region, category)
    total_orders = get_total_orders(cursor, year, region, category)
    profit_margin = get_profit_margin(cursor, year, region, category)

    # charts
    revenue_trend = get_revenue_by_month(cursor, year, region, category)
    sales_by_category = get_sales_by_category(cursor, year, region, category)
    top_states_revenue = get_top_states_by_revenue(cursor, year, region, category)
    
    cursor.close()
    conn.close()

    return {
        "cards": {
            "total_sales": total_sales,
            "total_profit" : total_profit,
            "total_orders" : total_orders,
            "profit_margin" : profit_margin
        },
        "charts": {
            "revenue_trend": revenue_trend,
            "sales_by_category": sales_by_category,
            "top_states_revenue": top_states_revenue 
        }
    }

@app.get("/insights")
def insights():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    # Get return rate by manager
    return_rate_data = get_return_rate_by_manager(cursor)
    
    cursor.close()
    conn.close()

    return {
        "return_rate_by_manager": return_rate_data
    }

@app.get("/insights/customers")
def insights_customers(state: str):
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    # Get top customers by state
    top_customers_data = get_top_customers_by_state(cursor, state)
    
    cursor.close()
    conn.close()

    return {
        "top_customers_by_state": top_customers_data
    }

@app.get("/insights/states")
def get_states():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    states = get_all_states(cursor)
    
    cursor.close()
    conn.close()

    return {"states": states}

@app.get("/insights/shipping")
def shipping_performance():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    shipping_data = get_shipping_performance(cursor)
    
    cursor.close()
    conn.close()

    return {"shipping_performance": shipping_data}

@app.get("/insights/growth")
def growth_data(year: int = None):
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    mom_growth = get_mom_growth(cursor, year)
    
    cursor.close()
    conn.close()

    return {"mom_growth": mom_growth}

@app.get("/insights/years")
def available_years():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    years = get_available_years(cursor)
    
    cursor.close()
    conn.close()

    return {"years": years}

@app.get("/insights/profit-loss")
def profit_loss():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    profit_loss_data = get_profit_loss_analysis(cursor)
    
    cursor.close()
    conn.close()

    return {"profit_loss": profit_loss_data}

@app.get("/insights/top-loss-products")
def top_loss_products():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    loss_products = get_top_loss_products(cursor)
    
    cursor.close()
    conn.close()

    return {"top_loss_products": loss_products}

@app.get("/insights/top-profit-products")
def top_profit_products():
    conn = get_db_connection() 
    cursor = conn.cursor(dictionary=True)
    
    profit_products = get_top_profit_products(cursor)
    
    cursor.close()
    conn.close()

    return {"top_profit_products": profit_products}
