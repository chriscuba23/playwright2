from playwright.sync_api import sync_playwright #  your program will execute the second line once the first line is executed successfully

with sync_playwright() as p: # use the import library

    browser = p.chromium.launch(headless=False, args=["--start-maximized"]) # decide which browser to run and if it is headless or not or maximized
    page = browser.new_page(no_viewport=True) # declare a new page and disable fixed viewport when launching a context or page
    page.goto('https://bstackdemo.com/') # go to the given url
    page.click('#signin')
    page.screenshot(path='sync1.png') # grab a screenshot
    browser.close()