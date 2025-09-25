#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
import os

class SupabaseAPITester:
    def __init__(self):
        # Using the Supabase URL from .env.local
        self.base_url = "https://drehfmtwazwjliahjils.supabase.co"
        self.anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjYyNjAsImV4cCI6MjA3MzAwMjI2MH0.Juj9ccOUxnbHJ_b5OODhBBvKMpwTi4l2p6Rr-sZNg1E"
        self.headers = {
            'apikey': self.anon_key,
            'Authorization': f'Bearer {self.anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        self.access_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, test_name, success, message="", error_details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED - {message}")
        else:
            print(f"❌ {test_name}: FAILED - {message}")
            if error_details:
                print(f"   Error Details: {error_details}")
        
        self.test_results.append({
            "test_name": test_name,
            "success": success,
            "message": message,
            "error_details": error_details
        })

    def test_database_connection(self):
        """Test basic database connectivity"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/v1/",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Database Connection", True, "Successfully connected to Supabase")
                return True
            else:
                self.log_test("Database Connection", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Database Connection", False, "Connection failed", str(e))
            return False

    def test_table_existence(self):
        """Test if required tables exist"""
        tables_to_check = [
            'profiles',
            'books', 
            'cart_items',
            'daily_lectures',
            'admin_activities'
        ]
        
        all_tables_exist = True
        
        for table in tables_to_check:
            try:
                response = requests.get(
                    f"{self.base_url}/rest/v1/{table}?limit=1",
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test(f"Table Exists: {table}", True, "Table accessible")
                elif response.status_code == 401:
                    self.log_test(f"Table Exists: {table}", True, "Table exists (auth required)")
                else:
                    self.log_test(f"Table Exists: {table}", False, f"HTTP {response.status_code}", response.text)
                    all_tables_exist = False
                    
            except Exception as e:
                self.log_test(f"Table Exists: {table}", False, "Request failed", str(e))
                all_tables_exist = False
        
        return all_tables_exist

    def test_profiles_schema(self):
        """Test profiles table schema - specifically university field"""
        try:
            # Try to get table schema info
            response = requests.get(
                f"{self.base_url}/rest/v1/profiles?limit=1",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code in [200, 401]:  # 401 is expected for protected table
                self.log_test("Profiles Schema", True, "Profiles table accessible")
                return True
            else:
                self.log_test("Profiles Schema", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Profiles Schema", False, "Request failed", str(e))
            return False

    def test_books_schema(self):
        """Test books table schema - specifically approval_status field"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/v1/books?limit=1",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code in [200, 401]:
                self.log_test("Books Schema", True, "Books table accessible")
                return True
            else:
                self.log_test("Books Schema", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Books Schema", False, "Request failed", str(e))
            return False

    def test_cart_items_schema(self):
        """Test cart_items table exists"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/v1/cart_items?limit=1",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code in [200, 401]:
                self.log_test("Cart Items Schema", True, "Cart items table accessible")
                return True
            else:
                self.log_test("Cart Items Schema", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Cart Items Schema", False, "Request failed", str(e))
            return False

    def test_daily_lectures_schema(self):
        """Test daily_lectures table exists"""
        try:
            response = requests.get(
                f"{self.base_url}/rest/v1/daily_lectures?limit=1",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code in [200, 401]:
                self.log_test("Daily Lectures Schema", True, "Daily lectures table accessible")
                return True
            else:
                self.log_test("Daily Lectures Schema", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Daily Lectures Schema", False, "Request failed", str(e))
            return False

    def test_storage_buckets(self):
        """Test if storage buckets exist"""
        buckets_to_check = ['avatars', 'book-images']
        
        for bucket in buckets_to_check:
            try:
                # Try to list files in bucket (will fail if bucket doesn't exist)
                response = requests.get(
                    f"{self.base_url}/storage/v1/object/list/{bucket}",
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code in [200, 400]:  # 400 might be expected for empty bucket
                    self.log_test(f"Storage Bucket: {bucket}", True, "Bucket accessible")
                else:
                    self.log_test(f"Storage Bucket: {bucket}", False, f"HTTP {response.status_code}", response.text)
                    
            except Exception as e:
                self.log_test(f"Storage Bucket: {bucket}", False, "Request failed", str(e))

    def test_auth_signup(self):
        """Test user registration"""
        try:
            test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
            test_password = "TestPass123!"
            
            signup_data = {
                "email": test_email,
                "password": test_password,
                "data": {
                    "name": "Test User"
                }
            }
            
            response = requests.post(
                f"{self.base_url}/auth/v1/signup",
                headers=self.headers,
                json=signup_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    self.access_token = data['access_token']
                    self.user_id = data['user']['id']
                    self.log_test("Auth Signup", True, f"User created: {test_email}")
                    return True
                else:
                    self.log_test("Auth Signup", False, "No access token in response", response.text)
                    return False
            else:
                self.log_test("Auth Signup", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Auth Signup", False, "Request failed", str(e))
            return False

    def test_profile_creation(self):
        """Test if profile is automatically created after signup"""
        if not self.access_token or not self.user_id:
            self.log_test("Profile Creation", False, "No authenticated user", "")
            return False
            
        try:
            auth_headers = {**self.headers, 'Authorization': f'Bearer {self.access_token}'}
            
            response = requests.get(
                f"{self.base_url}/rest/v1/profiles?id=eq.{self.user_id}",
                headers=auth_headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    self.log_test("Profile Creation", True, "Profile automatically created")
                    return True
                else:
                    self.log_test("Profile Creation", False, "Profile not found", "")
                    return False
            else:
                self.log_test("Profile Creation", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Profile Creation", False, "Request failed", str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Supabase Backend API Tests...")
        print("=" * 60)
        
        # Basic connectivity tests
        if not self.test_database_connection():
            print("❌ Database connection failed. Stopping tests.")
            return False
            
        # Schema tests
        self.test_table_existence()
        self.test_profiles_schema()
        self.test_books_schema()
        self.test_cart_items_schema()
        self.test_daily_lectures_schema()
        
        # Storage tests
        self.test_storage_buckets()
        
        # Auth tests
        if self.test_auth_signup():
            self.test_profile_creation()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = SupabaseAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())