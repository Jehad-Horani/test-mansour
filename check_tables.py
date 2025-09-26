#!/usr/bin/env python3

import requests
import json

# Supabase connection details
base_url = "https://drehfmtwazwjliahjils.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjYyNjAsImV4cCI6MjA3MzAwMjI2MH0.Juj9ccOUxnbHJ_b5OODhBBvKMpwTi4l2p6Rr-sZNg1E"

headers = {
    'apikey': anon_key,
    'Authorization': f'Bearer {anon_key}',
    'Content-Type': 'application/json'
}

# Try to get schema information
try:
    # This endpoint might give us information about available tables
    response = requests.get(f"{base_url}/rest/v1/", headers=headers)
    print("API Root Response:", response.status_code)
    if response.status_code == 200:
        print("Response:", response.text[:500])
    
    # Try some common table names to see what exists
    common_tables = [
        'profiles', 'books', 'daily_lectures', 'cart_items', 'admin_activities',
        'user_activities', 'notifications', 'book_images', 'system_settings'
    ]
    
    print("\n" + "="*50)
    print("CHECKING TABLE EXISTENCE:")
    print("="*50)
    
    existing_tables = []
    for table in common_tables:
        try:
            response = requests.get(f"{base_url}/rest/v1/{table}?limit=1", headers=headers)
            if response.status_code == 200:
                print(f"✅ {table}: EXISTS (accessible)")
                existing_tables.append(table)
            elif response.status_code == 401:
                print(f"🔒 {table}: EXISTS (auth required)")
                existing_tables.append(table)
            elif response.status_code == 404:
                print(f"❌ {table}: NOT FOUND")
            else:
                print(f"⚠️  {table}: HTTP {response.status_code}")
        except Exception as e:
            print(f"❌ {table}: ERROR - {str(e)}")
    
    print(f"\nFound {len(existing_tables)} accessible tables: {existing_tables}")
    
except Exception as e:
    print(f"Error: {e}")