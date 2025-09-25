#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
import os
import time

class NextJSAPITester:
    def __init__(self):
        # Using localhost for Next.js API testing
        self.base_url = "http://localhost:3000"
        self.api_base = f"{self.base_url}/api"
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        self.auth_token = None
        self.user_id = None
        self.admin_token = None
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
            "error_details": error_details,
            "timestamp": datetime.now().isoformat()
        })

    def test_server_health(self):
        """Test if Next.js server is running"""
        try:
            response = requests.get(self.base_url, timeout=10)
            if response.status_code == 200:
                self.log_test("Server Health", True, "Next.js server is running")
                return True
            else:
                self.log_test("Server Health", False, f"HTTP {response.status_code}", response.text[:200])
                return False
        except Exception as e:
            self.log_test("Server Health", False, "Server not accessible", str(e))
            return False

    def test_core_summaries_api(self):
        """Test the Core Summaries API - previously had database schema issues"""
        try:
            response = requests.get(f"{self.api_base}/summaries", headers=self.headers, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Core Summaries API", True, "API correctly requires authentication")
                return True
            elif response.status_code == 200:
                data = response.json()
                if isinstance(data, list) or (isinstance(data, dict) and 'data' in data):
                    self.log_test("Core Summaries API", True, "API returns proper array/object format")
                    return True
                else:
                    self.log_test("Core Summaries API", False, "API returns unexpected format", str(data))
                    return False
            else:
                self.log_test("Core Summaries API", False, f"HTTP {response.status_code}", response.text[:500])
                return False
                
        except Exception as e:
            self.log_test("Core Summaries API", False, "Request failed", str(e))
            return False

    def test_individual_book_api(self):
        """Test Individual Book Details API - previously had missing email column issue"""
        try:
            # Test with a proper UUID format
            test_book_id = "123e4567-e89b-12d3-a456-426614174000"
            response = requests.get(f"{self.api_base}/books/{test_book_id}", headers=self.headers, timeout=10)
            
            if response.status_code == 404:
                self.log_test("Individual Book API", True, "API correctly handles non-existent book (404)")
                return True
            elif response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and ('id' in data or 'book' in data):
                    self.log_test("Individual Book API", True, "API returns proper book object format")
                    return True
                else:
                    self.log_test("Individual Book API", False, "API returns unexpected format", str(data))
                    return False
            elif response.status_code == 500:
                # Check if it's still the database schema error
                error_text = response.text.lower()
                if 'email does not exist' in error_text or 'column' in error_text:
                    self.log_test("Individual Book API", False, "CRITICAL: Database schema issue still exists - missing email column", response.text[:500])
                    return False
                else:
                    self.log_test("Individual Book API", False, f"Server error: HTTP {response.status_code}", response.text[:500])
                    return False
            else:
                self.log_test("Individual Book API", False, f"HTTP {response.status_code}", response.text[:500])
                return False
                
        except Exception as e:
            self.log_test("Individual Book API", False, "Request failed", str(e))
            return False

    def test_profile_upload_avatar_api(self):
        """Test Profile Upload Avatar API - mentioned in user request"""
        try:
            response = requests.post(f"{self.api_base}/profile/upload-avatar", headers=self.headers, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Profile Upload Avatar API", True, "API correctly requires authentication")
                return True
            elif response.status_code == 400:
                self.log_test("Profile Upload Avatar API", True, "API correctly validates request format")
                return True
            else:
                self.log_test("Profile Upload Avatar API", False, f"HTTP {response.status_code}", response.text[:500])
                return False
                
        except Exception as e:
            self.log_test("Profile Upload Avatar API", False, "Request failed", str(e))
            return False

    def test_notebooks_api(self):
        """Test Notebooks API - mentioned in user request"""
        try:
            response = requests.get(f"{self.api_base}/notebooks", headers=self.headers, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Notebooks API", True, "API correctly requires authentication")
                return True
            elif response.status_code == 200:
                data = response.json()
                if isinstance(data, list) or (isinstance(data, dict) and 'data' in data):
                    self.log_test("Notebooks API", True, "API returns proper format")
                    return True
                else:
                    self.log_test("Notebooks API", False, "API returns unexpected format", str(data))
                    return False
            else:
                self.log_test("Notebooks API", False, f"HTTP {response.status_code}", response.text[:500])
                return False
                
        except Exception as e:
            self.log_test("Notebooks API", False, "Request failed", str(e))
            return False

    def test_notebooks_upload_api(self):
        """Test Notebooks Upload API - mentioned in user request"""
        try:
            response = requests.post(f"{self.api_base}/notebooks/upload", headers=self.headers, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Notebooks Upload API", True, "API correctly requires authentication")
                return True
            elif response.status_code == 400:
                self.log_test("Notebooks Upload API", True, "API correctly validates request format")
                return True
            else:
                self.log_test("Notebooks Upload API", False, f"HTTP {response.status_code}", response.text[:500])
                return False
                
        except Exception as e:
            self.log_test("Notebooks Upload API", False, "Request failed", str(e))
            return False

    def test_cart_api_comprehensive(self):
        """Test Cart API comprehensively - mentioned as fixed in user request"""
        try:
            # Test GET
            response = requests.get(f"{self.api_base}/cart", headers=self.headers, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Cart API (GET)", True, "API correctly requires authentication")
            elif response.status_code == 200:
                self.log_test("Cart API (GET)", True, "API returns cart data")
            else:
                self.log_test("Cart API (GET)", False, f"HTTP {response.status_code}", response.text[:500])
                return False

            # Test POST
            response = requests.post(f"{self.api_base}/cart", headers=self.headers, json={}, timeout=10)
            
            if response.status_code == 401:
                self.log_test("Cart API (POST)", True, "API correctly requires authentication")
            elif response.status_code == 400:
                self.log_test("Cart API (POST)", True, "API correctly validates request data")
            else:
                self.log_test("Cart API (POST)", False, f"HTTP {response.status_code}", response.text[:500])
                return False

            return True
                
        except Exception as e:
            self.log_test("Cart API", False, "Request failed", str(e))
            return False

    def test_admin_apis_comprehensive(self):
        """Test all Admin APIs mentioned in user request"""
        admin_endpoints = [
            "/admin/users",
            "/admin/books", 
            "/admin/analytics",
            "/admin/settings",
            "/admin/lectures"
        ]
        
        all_passed = True
        
        for endpoint in admin_endpoints:
            try:
                response = requests.get(f"{self.api_base}{endpoint}", headers=self.headers, timeout=10)
                
                if response.status_code == 401:
                    self.log_test(f"Admin API {endpoint}", True, "API correctly requires admin authentication")
                elif response.status_code == 403:
                    self.log_test(f"Admin API {endpoint}", True, "API correctly requires admin access")
                elif response.status_code == 200:
                    self.log_test(f"Admin API {endpoint}", True, "API accessible (admin authenticated)")
                else:
                    self.log_test(f"Admin API {endpoint}", False, f"HTTP {response.status_code}", response.text[:500])
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Admin API {endpoint}", False, "Request failed", str(e))
                all_passed = False
        
        return all_passed

    def test_file_upload_apis(self):
        """Test all file upload APIs mentioned in user request"""
        upload_endpoints = [
            "/profile/upload-avatar",
            "/summaries/upload",
            "/books/upload-image",
            "/notebooks/upload"
        ]
        
        all_passed = True
        
        for endpoint in upload_endpoints:
            try:
                response = requests.post(f"{self.api_base}{endpoint}", headers=self.headers, timeout=10)
                
                if response.status_code == 401:
                    self.log_test(f"Upload API {endpoint}", True, "API correctly requires authentication")
                elif response.status_code == 400:
                    self.log_test(f"Upload API {endpoint}", True, "API correctly validates file upload")
                elif response.status_code == 200:
                    self.log_test(f"Upload API {endpoint}", True, "API accessible")
                else:
                    self.log_test(f"Upload API {endpoint}", False, f"HTTP {response.status_code}", response.text[:500])
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Upload API {endpoint}", False, "Request failed", str(e))
                all_passed = False
        
        return all_passed

    def run_comprehensive_tests(self):
        """Run all comprehensive tests focusing on user's request"""
        print("🚀 Starting Comprehensive Next.js API Tests...")
        print("=" * 60)
        
        # Basic server health
        if not self.test_server_health():
            print("❌ Server not running. Stopping tests.")
            return False
        
        print("\n🔍 Testing Previously Stuck Tasks:")
        print("-" * 40)
        
        # Test the two previously stuck tasks
        self.test_core_summaries_api()
        self.test_individual_book_api()
        
        print("\n🔍 Testing New/Missing APIs:")
        print("-" * 40)
        
        # Test APIs mentioned in user request
        self.test_profile_upload_avatar_api()
        self.test_notebooks_api()
        self.test_notebooks_upload_api()
        
        print("\n🔍 Testing Core Functionality:")
        print("-" * 40)
        
        # Test core functionality
        self.test_cart_api_comprehensive()
        self.test_admin_apis_comprehensive()
        self.test_file_upload_apis()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            failed_tests = self.tests_run - self.tests_passed
            print(f"⚠️  {failed_tests} tests failed")
            
            # Show failed tests
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   - {result['test_name']}: {result['message']}")
            
            return False

def main():
    tester = NextJSAPITester()
    success = tester.run_comprehensive_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/nextjs_comprehensive_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())