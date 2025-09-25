#!/usr/bin/env python3

import requests
import json

# Supabase connection details
base_url = "https://drehfmtwazwjliahjils.supabase.co"
service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI"

headers = {
    'apikey': service_key,
    'Authorization': f'Bearer {service_key}',
    'Content-Type': 'application/json'
}

def execute_sql(sql_query):
    """Execute SQL query using Supabase REST API"""
    try:
        response = requests.post(
            f"{base_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={"query": sql_query}
        )
        
        print(f"SQL Query: {sql_query[:100]}...")
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SQL executed successfully")
            return True
        else:
            print(f"❌ SQL execution failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error executing SQL: {e}")
        return False

def check_table_schema(table_name):
    """Check if table exists and get its schema"""
    try:
        response = requests.get(
            f"{base_url}/rest/v1/{table_name}?limit=1",
            headers=headers
        )
        
        if response.status_code == 200:
            print(f"✅ Table {table_name} exists and is accessible")
            return True
        elif response.status_code == 404:
            print(f"❌ Table {table_name} does not exist")
            return False
        else:
            print(f"⚠️ Table {table_name} status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking table {table_name}: {e}")
        return False

def check_column_exists(table_name, column_name):
    """Check if a specific column exists in a table"""
    try:
        # Try to select the specific column
        response = requests.get(
            f"{base_url}/rest/v1/{table_name}?select={column_name}&limit=1",
            headers=headers
        )
        
        if response.status_code == 200:
            print(f"✅ Column {table_name}.{column_name} exists")
            return True
        elif response.status_code == 400:
            error_data = response.json()
            if "does not exist" in error_data.get("message", ""):
                print(f"❌ Column {table_name}.{column_name} does not exist")
                return False
            else:
                print(f"⚠️ Column check error: {error_data}")
                return False
        else:
            print(f"⚠️ Column check status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking column {table_name}.{column_name}: {e}")
        return False

def main():
    print("🔧 Checking and fixing database schema issues...")
    print("=" * 60)
    
    # Check existing tables
    print("\n📋 Checking table existence:")
    tables_to_check = ['profiles', 'books', 'cart_items', 'daily_lectures', 'user_activities']
    
    for table in tables_to_check:
        check_table_schema(table)
    
    # Check specific columns
    print("\n📋 Checking critical columns:")
    check_column_exists('books', 'approval_status')
    
    # Try to create missing cart_items table
    print("\n🛠️ Creating missing cart_items table...")
    
    cart_items_sql = """
    CREATE TABLE IF NOT EXISTS public.cart_items (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, book_id)
    );
    
    -- Enable RLS
    ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view their own cart items" ON public.cart_items
        FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own cart items" ON public.cart_items
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own cart items" ON public.cart_items
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own cart items" ON public.cart_items
        FOR DELETE USING (auth.uid() = user_id);
    """
    
    # Note: Direct SQL execution via REST API might not work, let's try a different approach
    print("⚠️ Direct SQL execution via REST API is not available.")
    print("The cart_items table needs to be created via Supabase dashboard or migration.")
    
    # Try to add approval_status column to books table
    print("\n🛠️ Checking books table schema...")
    
    # Let's see what columns exist in books table
    try:
        response = requests.get(f"{base_url}/rest/v1/books?limit=1", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data:
                print("✅ Books table accessible, sample record keys:")
                print(list(data[0].keys()) if data else "No records found")
            else:
                print("✅ Books table exists but is empty")
        else:
            print(f"❌ Cannot access books table: {response.status_code}")
    except Exception as e:
        print(f"❌ Error checking books table: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Schema check completed")
    print("\nRequired manual fixes:")
    print("1. Create cart_items table via Supabase dashboard")
    print("2. Add approval_status column to books table")
    print("3. Create admin user with correct credentials")

if __name__ == "__main__":
    main()