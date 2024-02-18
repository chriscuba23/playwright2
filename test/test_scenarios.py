import pytest
from playwright.sync_api import Page
from playwright.sync_api import expect

def test_login(page: Page):
#launch browserstack demo
    page.goto("https://bstackdemo.com/")
    #click on sign button
    page.click('#signin')
    #select Username
    page.get_by_text("Select Username").click()
    page.locator("#react-select-2-option-0-0").click()
    #select Password
    page.get_by_text("Select Password").click()
    page.locator("#react-select-3-option-0-0").click()
    #click login
    page.get_by_role("button", name="Log In").click()
    #verify user have logged in
    assert page.get_by_text("demouser").is_visible()
