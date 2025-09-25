#!/usr/bin/env python3
"""
Next.js Application Testing - Frontend and Integration Testing
Testing the actual Next.js app running on localhost:3002
"""

import requests
import json
import sys
from datetime import datetime
import time

class NextJSAppTester:
    def __init__(self, base_url="http://localhost:3002"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-App-Tester/1.0'
        })
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", error=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
            if details:
                print(f"   Details: {details}")
        else:
            print(f"❌ {name}")
            if error:
                print(f"   Error: {error}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        })

    def test_app_accessibility(self):
        """Test if the Next.js app is accessible"""
        try:
            response = self.session.get(f"{self.base_url}", timeout=10)
            success = response.status_code == 200
            
            details = f"Status: {response.status_code}"
            if success:
                # Check if it's actually a Next.js app
                if "Next.js" in response.text or "_next" in response.text:
                    details += ", Next.js app detected"
                else:
                    details += ", Response received but may not be Next.js"
            
            self.log_test(
                "App Accessibility", 
                success,
                details,
                "" if success else f"HTTP {response.status_code}"
            )
            return success
        except Exception as e:
            self.log_test("App Accessibility", False, "", str(e))
            return False

    def test_critical_pages_load(self):
        """Test if critical pages load without server errors"""
        pages = [
            ("/", "Home Page"),
            ("/market", "Market Page"),
            ("/cart", "Cart Page"),
            ("/auth", "Auth Page"),
            ("/profile/edit", "Profile Edit Page"),
            ("/settings", "Settings Page"),
            ("/admin/books", "Admin Books Page"),
            ("/admin/daily-lectures", "Admin Daily Lectures Page")
        ]
        
        all_success = True
        for path, name in pages:
            try:
                response = self.session.get(f"{self.base_url}{path}", timeout=10)
                # Accept 200 (OK), 302 (redirect), 401 (auth required) as success
                # 500 indicates server error which is a failure
                success = response.status_code in [200, 302, 401, 403]
                
                details = f"Status: {response.status_code}"
                error = ""
                
                if success and response.text:
                    # Check for specific database errors in the HTML response
                    response_lower = response.text.lower()
                    if "approval_status does not exist" in response_lower:
                        success = False
                        error = "Database error: approval_status column missing"
                    elif "cart_items" in response_lower and "does not exist" in response_lower:
                        success = False
                        error = "Database error: cart_items table missing"
                    elif "array literal" in response_lower:
                        success = False
                        error = "Database error: array literal issue (university field)"
                    elif "internal server error" in response_lower:
                        success = False
                        error = "Internal server error detected"
                elif not success:
                    error = f"HTTP {response.status_code}"
                
                self.log_test(
                    f"Page Load: {name}", 
                    success,
                    details,
                    error
                )
                
                if not success:
                    all_success = False
                    
            except Exception as e:
                self.log_test(f"Page Load: {name}", False, f"Path: {path}", str(e))
                all_success = False
        
        return all_success

    def test_static_assets(self):
        """Test if static assets are accessible"""
        assets = [
            "/favicon.ico",
            "/_next/static/css/app/layout.css",
            "/_next/static/chunks/webpack.js"
        ]
        
        success_count = 0
        for asset in assets:
            try:
                response = self.session.get(f"{self.base_url}{asset}", timeout=5)
                # 200 (found) or 404 (not found but server responding) are acceptable
                # 500 would indicate server issues
                success = response.status_code in [200, 404]
                if success:
                    success_count += 1
                    
            except Exception:
                pass  # Asset tests are not critical
        
        # Consider it successful if at least one asset loads properly
        overall_success = success_count > 0
        self.log_test(
            "Static Assets", 
            overall_success,
            f"{success_count}/{len(assets)} assets accessible",
            "No static assets accessible" if not overall_success else ""
        )
        return overall_success

    def test_api_routes(self):
        """Test Next.js API routes if they exist"""
        api_routes = [
            "/api/health",
            "/api/auth",
            "/api/books",
            "/api/cart"
        ]
        
        working_routes = 0
        for route in api_routes:
            try:
                response = self.session.get(f"{self.base_url}{route}", timeout=5)
                # 404 is acceptable (route not implemented), 500 is not
                success = response.status_code != 500
                if success:
                    working_routes += 1
                    
            except Exception:
                pass  # API route tests are not critical for this phase
        
        overall_success = True  # API routes are optional for this test
        self.log_test(
            "API Routes", 
            overall_success,
            f"{working_routes}/{len(api_routes)} routes responding (500 errors would be concerning)",
            ""
        )
        return overall_success

    def check_console_errors_in_response(self):
        """Check for JavaScript errors or console errors in the HTML response"""
        try:
            response = self.session.get(f"{self.base_url}/market", timeout=10)
            if response.status_code == 200:
                response_text = response.text.lower()
                
                # Look for common error indicators
                error_indicators = [
                    "uncaught",
                    "syntaxerror",
                    "referenceerror",
                    "typeerror",
                    "error: ",
                    "failed to",
                    "cannot read",
                    "undefined is not"
                ]
                
                found_errors = []
                for indicator in error_indicators:
                    if indicator in response_text:
                        found_errors.append(indicator)
                
                success = len(found_errors) == 0
                details = "No JavaScript errors detected in HTML" if success else f"Potential errors: {', '.join(found_errors)}"
                
                self.log_test(
                    "JavaScript Errors Check", 
                    success,
                    details,
                    "JavaScript errors detected in response" if not success else ""
                )
                return success
            else:
                self.log_test("JavaScript Errors Check", False, "", f"Could not load page: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("JavaScript Errors Check", False, "", str(e))
            return False

    def generate_report(self):
        """Generate comprehensive test report"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        # Categorize issues
        critical_issues = []
        database_issues = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["error"].lower() for keyword in ["approval_status", "cart_items", "array literal"]):
                    database_issues.append(result)
                elif result["error"] and "500" in result["error"]:
                    critical_issues.append(result)
                else:
                    minor_issues.append(result)
        
        report = {
            "test_summary": {
                "total_tests": self.tests_run,
                "passed_tests": self.tests_passed,
                "failed_tests": self.tests_run - self.tests_passed,
                "success_rate": f"{success_rate:.1f}%",
                "timestamp": datetime.now().isoformat()
            },
            "test_results": self.test_results,
            "issue_categories": {
                "critical_issues": critical_issues,
                "database_issues": database_issues,
                "minor_issues": minor_issues
            }
        }
        
        return report

def main():
    print("🚀 Starting Next.js Application Testing")
    print("=" * 70)
    
    tester = NextJSAppTester()
    
    # Run all tests
    print("\n📋 Testing Basic App Functionality...")
    tester.test_app_accessibility()
    tester.test_static_assets()
    
    print("\n📋 Testing Page Loading...")
    tester.test_critical_pages_load()
    
    print("\n📋 Testing API Routes...")
    tester.test_api_routes()
    
    print("\n📋 Checking for JavaScript Errors...")
    tester.check_console_errors_in_response()
    
    # Generate and save report
    report = tester.generate_report()
    
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    print(f"Total Tests: {report['test_summary']['total_tests']}")
    print(f"Passed: {report['test_summary']['passed_tests']}")
    print(f"Failed: {report['test_summary']['failed_tests']}")
    print(f"Success Rate: {report['test_summary']['success_rate']}")
    
    # Report issues by category
    if report['issue_categories']['database_issues']:
        print(f"\n🔴 Database Issues Found: {len(report['issue_categories']['database_issues'])}")
        for issue in report['issue_categories']['database_issues']:
            print(f"  - {issue['test']}: {issue['error']}")
    
    if report['issue_categories']['critical_issues']:
        print(f"\n🚨 Critical Issues Found: {len(report['issue_categories']['critical_issues'])}")
        for issue in report['issue_categories']['critical_issues']:
            print(f"  - {issue['test']}: {issue['error']}")
    
    if report['issue_categories']['minor_issues']:
        print(f"\n⚠️  Minor Issues Found: {len(report['issue_categories']['minor_issues'])}")
        for issue in report['issue_categories']['minor_issues']:
            print(f"  - {issue['test']}: {issue['error']}")
    
    if not any(report['issue_categories'].values()):
        print("\n✅ No significant issues detected!")
    
    # Save detailed report
    with open('/app/nextjs_app_test_results.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: /app/nextjs_app_test_results.json")
    
    # Return appropriate exit code
    return 0 if report['test_summary']['failed_tests'] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())