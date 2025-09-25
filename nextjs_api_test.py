#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime
import os
import time

class NextJSAPITester:
    def __init__(self):
        # Using localhost for Next.js app
        self.base_url = "http://localhost:3000"
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        self.auth_token = None
        self.admin_token = None
        self.user_id = None
        self.admin_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_book_id = None
        self.created_summary_id = None

    def log_test(self, test_name, success, message="", error_details="", response_data=None):
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
            "response_data": response_data if response_data else None,
            "timestamp": datetime.now().isoformat()
        })

    def make_request(self, method, endpoint, data=None, headers=None, timeout=10):
        """Make HTTP request with error handling"""
        try:
            url = f"{self.base_url}{endpoint}"
            request_headers = {**self.headers}
            if headers:
                request_headers.update(headers)
            
            if method.upper() == 'GET':
                response = requests.get(url, headers=request_headers, timeout=timeout)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=request_headers, json=data, timeout=timeout)
            elif method.upper() == 'PATCH':
                response = requests.patch(url, headers=request_headers, json=data, timeout=timeout)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=request_headers, json=data, timeout=timeout)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except Exception as e:
            return None, str(e)

    def test_core_summaries_api(self):
        """Test /api/summaries endpoint"""
        print("\n🔍 Testing Core Summaries API...")
        
        # Test GET /api/summaries
        response = self.make_request('GET', '/api/summaries')
        if isinstance(response, tuple):
            self.log_test("GET /api/summaries", False, "Request failed", response[1])
            return False
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/summaries", True, f"Returns array with {len(data)} items")
                else:
                    self.log_test("GET /api/summaries", False, "Response is not an array", f"Got: {type(data)}")
                    return False
            except json.JSONDecodeError:
                self.log_test("GET /api/summaries", False, "Invalid JSON response", response.text[:200])
                return False
        else:
            self.log_test("GET /api/summaries", False, f"HTTP {response.status_code}", response.text[:200])
            return False
        
        # Test POST /api/summaries (requires auth)
        test_summary = {
            "title": "Test Summary",
            "subject_name": "Computer Science",
            "university_name": "Test University",
            "semester": "Fall 2024",
            "college": "Engineering",
            "major": "Computer Science",
            "description": "Test summary description",
            "file_url": "https://example.com/test.pdf",
            "file_name": "test.pdf",
            "file_size": 1024
        }
        
        response = self.make_request('POST', '/api/summaries', test_summary)
        if isinstance(response, tuple):
            self.log_test("POST /api/summaries", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("POST /api/summaries", True, "Correctly requires authentication")
        elif response.status_code == 200:
            try:
                data = response.json()
                self.created_summary_id = data.get('id')
                self.log_test("POST /api/summaries", True, "Summary created successfully")
            except json.JSONDecodeError:
                self.log_test("POST /api/summaries", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("POST /api/summaries", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_cart_management_api(self):
        """Test /api/cart endpoint"""
        print("\n🛒 Testing Cart Management API...")
        
        # Test GET /api/cart (requires auth)
        response = self.make_request('GET', '/api/cart')
        if isinstance(response, tuple):
            self.log_test("GET /api/cart", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("GET /api/cart", True, "Correctly requires authentication")
        elif response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/cart", True, f"Returns cart items array with {len(data)} items")
                else:
                    self.log_test("GET /api/cart", False, "Response is not an array", f"Got: {type(data)}")
            except json.JSONDecodeError:
                self.log_test("GET /api/cart", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/cart", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test POST /api/cart (requires auth)
        test_cart_item = {
            "bookId": "test-book-id",
            "quantity": 1
        }
        
        response = self.make_request('POST', '/api/cart', test_cart_item)
        if isinstance(response, tuple):
            self.log_test("POST /api/cart", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("POST /api/cart", True, "Correctly requires authentication")
        else:
            self.log_test("POST /api/cart", False, f"Unexpected status: {response.status_code}", response.text[:200])
        
        # Test PATCH /api/cart (requires auth)
        test_update = {
            "cartItemId": "test-item-id",
            "quantity": 2
        }
        
        response = self.make_request('PATCH', '/api/cart', test_update)
        if isinstance(response, tuple):
            self.log_test("PATCH /api/cart", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("PATCH /api/cart", True, "Correctly requires authentication")
        else:
            self.log_test("PATCH /api/cart", False, f"Unexpected status: {response.status_code}", response.text[:200])
        
        # Test DELETE /api/cart (requires auth)
        response = self.make_request('DELETE', '/api/cart?itemId=test-item-id')
        if isinstance(response, tuple):
            self.log_test("DELETE /api/cart", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("DELETE /api/cart", True, "Correctly requires authentication")
        else:
            self.log_test("DELETE /api/cart", False, f"Unexpected status: {response.status_code}", response.text[:200])
        
        return True

    def test_books_api(self):
        """Test /api/books endpoint"""
        print("\n📚 Testing Books API...")
        
        # Test GET /api/books
        response = self.make_request('GET', '/api/books')
        if isinstance(response, tuple):
            self.log_test("GET /api/books", False, "Request failed", response[1])
            return False
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'books' in data and 'pagination' in data:
                    books = data['books']
                    pagination = data['pagination']
                    self.log_test("GET /api/books", True, f"Returns {len(books)} books with pagination")
                else:
                    self.log_test("GET /api/books", False, "Missing books or pagination in response", str(data.keys()))
            except json.JSONDecodeError:
                self.log_test("GET /api/books", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/books", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test GET /api/books with search parameters
        response = self.make_request('GET', '/api/books?search=test&category=Computer Science&sortBy=newest')
        if isinstance(response, tuple):
            self.log_test("GET /api/books (with params)", False, "Request failed", response[1])
            return False
        
        if response.status_code == 200:
            self.log_test("GET /api/books (with params)", True, "Search and filter parameters work")
        else:
            self.log_test("GET /api/books (with params)", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test POST /api/books (requires auth)
        test_book = {
            "title": "Test Book",
            "author": "Test Author",
            "description": "Test book description",
            "major": "Computer Science",
            "university_name": "Test University",
            "condition": "good",
            "original_price": 100,
            "selling_price": 80,
            "is_available": True
        }
        
        response = self.make_request('POST', '/api/books', test_book)
        if isinstance(response, tuple):
            self.log_test("POST /api/books", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("POST /api/books", True, "Correctly requires authentication")
        elif response.status_code == 200:
            try:
                data = response.json()
                self.created_book_id = data.get('id')
                self.log_test("POST /api/books", True, "Book created successfully")
            except json.JSONDecodeError:
                self.log_test("POST /api/books", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("POST /api/books", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_individual_book_api(self):
        """Test /api/books/[id] endpoint"""
        print("\n📖 Testing Individual Book API...")
        
        # Test with a test ID
        test_id = "test-book-id"
        response = self.make_request('GET', f'/api/books/{test_id}')
        if isinstance(response, tuple):
            self.log_test("GET /api/books/[id]", False, "Request failed", response[1])
            return False
        
        if response.status_code == 404:
            self.log_test("GET /api/books/[id]", True, "Correctly returns 404 for non-existent book")
        elif response.status_code == 200:
            try:
                data = response.json()
                self.log_test("GET /api/books/[id]", True, "Returns book details")
            except json.JSONDecodeError:
                self.log_test("GET /api/books/[id]", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/books/[id]", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_admin_users_api(self):
        """Test /api/admin/users endpoint"""
        print("\n👥 Testing Admin Users API...")
        
        # Test GET /api/admin/users (requires admin)
        response = self.make_request('GET', '/api/admin/users')
        if isinstance(response, tuple):
            self.log_test("GET /api/admin/users", False, "Request failed", response[1])
            return False
        
        if response.status_code == 403:
            self.log_test("GET /api/admin/users", True, "Correctly requires admin access")
        elif response.status_code == 401:
            self.log_test("GET /api/admin/users", True, "Correctly requires authentication")
        elif response.status_code == 200:
            try:
                data = response.json()
                if 'users' in data and 'pagination' in data:
                    self.log_test("GET /api/admin/users", True, f"Returns users with pagination")
                else:
                    self.log_test("GET /api/admin/users", False, "Missing users or pagination", str(data.keys()))
            except json.JSONDecodeError:
                self.log_test("GET /api/admin/users", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/admin/users", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test PATCH /api/admin/users (requires admin)
        test_update = {
            "userId": "test-user-id",
            "updates": {"name": "Updated Name"}
        }
        
        response = self.make_request('PATCH', '/api/admin/users', test_update)
        if isinstance(response, tuple):
            self.log_test("PATCH /api/admin/users", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("PATCH /api/admin/users", True, "Correctly requires admin access")
        else:
            self.log_test("PATCH /api/admin/users", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_admin_books_api(self):
        """Test /api/admin/books endpoint"""
        print("\n📚 Testing Admin Books API...")
        
        # Test GET /api/admin/books (requires admin)
        response = self.make_request('GET', '/api/admin/books?status=pending')
        if isinstance(response, tuple):
            self.log_test("GET /api/admin/books", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("GET /api/admin/books", True, "Correctly requires admin access")
        elif response.status_code == 200:
            try:
                data = response.json()
                if 'books' in data and 'pagination' in data:
                    self.log_test("GET /api/admin/books", True, "Returns books with pagination")
                else:
                    self.log_test("GET /api/admin/books", False, "Missing books or pagination", str(data.keys()))
            except json.JSONDecodeError:
                self.log_test("GET /api/admin/books", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/admin/books", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test PATCH /api/admin/books (requires admin)
        test_approval = {
            "bookId": "test-book-id",
            "action": "approve"
        }
        
        response = self.make_request('PATCH', '/api/admin/books', test_approval)
        if isinstance(response, tuple):
            self.log_test("PATCH /api/admin/books", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("PATCH /api/admin/books", True, "Correctly requires admin access")
        else:
            self.log_test("PATCH /api/admin/books", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test DELETE /api/admin/books (requires admin)
        test_delete = {
            "bookId": "test-book-id"
        }
        
        response = self.make_request('DELETE', '/api/admin/books', test_delete)
        if isinstance(response, tuple):
            self.log_test("DELETE /api/admin/books", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("DELETE /api/admin/books", True, "Correctly requires admin access")
        else:
            self.log_test("DELETE /api/admin/books", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_admin_analytics_api(self):
        """Test /api/admin/analytics endpoint"""
        print("\n📊 Testing Admin Analytics API...")
        
        response = self.make_request('GET', '/api/admin/analytics')
        if isinstance(response, tuple):
            self.log_test("GET /api/admin/analytics", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("GET /api/admin/analytics", True, "Correctly requires admin access")
        elif response.status_code == 200:
            try:
                data = response.json()
                expected_keys = ['overview', 'users', 'books', 'summaries', 'lectures', 'monthlyGrowth']
                missing_keys = [key for key in expected_keys if key not in data]
                if not missing_keys:
                    self.log_test("GET /api/admin/analytics", True, "Returns comprehensive analytics data")
                else:
                    self.log_test("GET /api/admin/analytics", False, f"Missing keys: {missing_keys}", str(data.keys()))
            except json.JSONDecodeError:
                self.log_test("GET /api/admin/analytics", False, "Invalid JSON response", response.text[:200])
        else:
            self.log_test("GET /api/admin/analytics", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_admin_settings_api(self):
        """Test /api/admin/settings endpoint"""
        print("\n⚙️ Testing Admin Settings API...")
        
        response = self.make_request('GET', '/api/admin/settings')
        if isinstance(response, tuple):
            self.log_test("GET /api/admin/settings", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("GET /api/admin/settings", True, "Correctly requires admin access")
        elif response.status_code == 200:
            self.log_test("GET /api/admin/settings", True, "Returns system settings")
        else:
            self.log_test("GET /api/admin/settings", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_admin_lectures_api(self):
        """Test /api/admin/lectures endpoint"""
        print("\n🎓 Testing Admin Lectures API...")
        
        response = self.make_request('GET', '/api/admin/lectures')
        if isinstance(response, tuple):
            self.log_test("GET /api/admin/lectures", False, "Request failed", response[1])
            return False
        
        if response.status_code in [403, 401]:
            self.log_test("GET /api/admin/lectures", True, "Correctly requires admin access")
        elif response.status_code == 200:
            self.log_test("GET /api/admin/lectures", True, "Returns lectures data")
        else:
            self.log_test("GET /api/admin/lectures", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_summaries_upload_api(self):
        """Test /api/summaries/upload endpoint"""
        print("\n📤 Testing Summaries Upload API...")
        
        # This would typically require multipart/form-data for file upload
        response = self.make_request('POST', '/api/summaries/upload', {})
        if isinstance(response, tuple):
            self.log_test("POST /api/summaries/upload", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("POST /api/summaries/upload", True, "Correctly requires authentication")
        elif response.status_code == 400:
            self.log_test("POST /api/summaries/upload", True, "Correctly validates file upload")
        else:
            self.log_test("POST /api/summaries/upload", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_summaries_approve_reject_api(self):
        """Test /api/summaries/approve and /api/summaries/reject endpoints"""
        print("\n✅ Testing Summaries Approve/Reject API...")
        
        # Test approve endpoint
        test_approve = {
            "summaryId": "test-summary-id"
        }
        
        response = self.make_request('POST', '/api/summaries/approve', test_approve)
        if isinstance(response, tuple):
            self.log_test("POST /api/summaries/approve", False, "Request failed", response[1])
        elif response.status_code in [403, 401]:
            self.log_test("POST /api/summaries/approve", True, "Correctly requires admin access")
        else:
            self.log_test("POST /api/summaries/approve", False, f"HTTP {response.status_code}", response.text[:200])
        
        # Test reject endpoint
        test_reject = {
            "summaryId": "test-summary-id",
            "reason": "Test rejection reason"
        }
        
        response = self.make_request('POST', '/api/summaries/reject', test_reject)
        if isinstance(response, tuple):
            self.log_test("POST /api/summaries/reject", False, "Request failed", response[1])
        elif response.status_code in [403, 401]:
            self.log_test("POST /api/summaries/reject", True, "Correctly requires admin access")
        else:
            self.log_test("POST /api/summaries/reject", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def test_book_image_upload_api(self):
        """Test /api/books/upload-image endpoint"""
        print("\n🖼️ Testing Book Image Upload API...")
        
        response = self.make_request('POST', '/api/books/upload-image', {})
        if isinstance(response, tuple):
            self.log_test("POST /api/books/upload-image", False, "Request failed", response[1])
            return False
        
        if response.status_code == 401:
            self.log_test("POST /api/books/upload-image", True, "Correctly requires authentication")
        elif response.status_code == 400:
            self.log_test("POST /api/books/upload-image", True, "Correctly validates image upload")
        else:
            self.log_test("POST /api/books/upload-image", False, f"HTTP {response.status_code}", response.text[:200])
        
        return True

    def run_all_tests(self):
        """Run all Next.js API tests"""
        print("🚀 Starting Next.js API Tests...")
        print("=" * 60)
        
        # Test core APIs
        self.test_core_summaries_api()
        self.test_summaries_upload_api()
        self.test_summaries_approve_reject_api()
        
        # Test cart and market APIs
        self.test_cart_management_api()
        self.test_books_api()
        self.test_individual_book_api()
        self.test_book_image_upload_api()
        
        # Test admin APIs
        self.test_admin_users_api()
        self.test_admin_books_api()
        self.test_admin_analytics_api()
        self.test_admin_settings_api()
        self.test_admin_lectures_api()
        
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
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/nextjs_api_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/nextjs_api_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())